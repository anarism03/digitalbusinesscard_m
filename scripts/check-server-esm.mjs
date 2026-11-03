import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// Vercel transpiles each function dependency individually. Validate the same
// output with native Node rather than a loader that fixes imports implicitly.
const root = process.cwd();
const temporary = fs.mkdtempSync(path.join(root, ".server-esm-"));
const visited = new Set();

function compile(file) {
  if (visited.has(file)) return;
  visited.add(file);
  const source = fs.readFileSync(file, "utf8");
  const output = ts.transpileModule(source, {
    fileName: file,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const target = path
    .join(temporary, path.relative(root, file))
    .replace(/\.tsx?$/, ".js");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, output);
  for (const match of output.matchAll(
    /(?:from\s*|import\s*\(\s*|import\s*)(["'])(\.[^"']+)\1/g,
  )) {
    const specifier = match[2];
    if (!specifier.endsWith(".js"))
      throw new Error(
        `Native ESM requires .js imports: ${specifier} in ${path.relative(root, file)}`,
      );
    const base = path.resolve(path.dirname(file), specifier.slice(0, -3));
    const dependency = [base + ".ts", base + ".tsx"].find((candidate) =>
      fs.existsSync(candidate),
    );
    if (!dependency)
      throw new Error(`Cannot resolve ${specifier} from ${file}`);
    compile(dependency);
  }
}

try {
  fs.writeFileSync(
    path.join(temporary, "package.json"),
    JSON.stringify({ type: "module" }),
  );
  compile(path.join(root, "api/index.ts"));
  const moduleUrl = (relative) =>
    JSON.stringify(pathToFileURL(path.join(temporary, relative)).href);
  const child = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `
    await import(${moduleUrl("server/application.js")});
    await import(${moduleUrl("server/exports.js")});
    const { default: api } = await import(${moduleUrl("api/index.js")});
    if (typeof api.fetch !== 'function') throw new Error('Missing fetch handler');
  `,
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (child.status !== 0)
    throw new Error(
      child.stderr || child.error?.message || "API module check failed",
    );
  console.log(`Native Node API module check passed (${visited.size} modules).`);
} finally {
  const checked = path.resolve(temporary);
  if (!checked.startsWith(path.resolve(root) + path.sep + ".server-esm-"))
    throw new Error("Unexpected temporary path");
  fs.rmSync(checked, { recursive: true, force: true });
}
