import { AUTH_KEY, createSeed, DATABASE_KEY, type DemoDatabase } from "./seed";

let memory: DemoDatabase | undefined;
window.addEventListener("storage", (event) => {
  if (event.key === DATABASE_KEY || event.key === null) memory = undefined;
});
export function readDatabase(): DemoDatabase {
  if (memory) return structuredClone(memory);
  try {
    const raw = localStorage.getItem(DATABASE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (
      parsed?.version === 1 &&
      Array.isArray(parsed.employees) &&
      Array.isArray(parsed.companies) &&
      Array.isArray(parsed.scans) &&
      Array.isArray(parsed.audit)
    )
      memory = parsed;
  } catch {
    /* Seed a fresh demo if browser data is damaged. */
  }
  if (!memory) {
    memory = createSeed();
    writeDatabase(memory);
  }
  return structuredClone(memory);
}
export function writeDatabase(db: DemoDatabase) {
  try {
    localStorage.setItem(DATABASE_KEY, JSON.stringify(db));
  } catch {
    throw new Error(
      "Brauzerin yaddaşı dolub. Daha kiçik şəkil seçin və ya demo məlumatlarını sıfırlayın.",
    );
  }
  memory = structuredClone(db);
}
export function resetDemo() {
  localStorage.removeItem(DATABASE_KEY);
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem("dbc-appearance-v1");
  memory = undefined;
  window.location.assign("/login");
}
