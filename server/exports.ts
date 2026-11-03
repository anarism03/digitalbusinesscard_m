import type { DemoAccount, DemoDatabase } from "../src/mock/seed.js";
import { DEMO_PASSWORD } from "../src/mock/seed.js";
import { buildVcfText } from "../src/utils/vcard.js";
import { buildViewLinkRows } from "../src/utils/cardLinkRows.js";

interface ExportContext {
  origin: string;
  assetData: (path?: string) => Promise<string>;
  path: string;
  parts: string[];
  raw: unknown;
  body: unknown;
  db: DemoDatabase;
  current: DemoAccount;
  requireCompany: (id: string) => void;
  fail: (message: string, status?: number) => never;
  audit: (
    id: string,
    entity: string,
    action: string,
    before?: unknown,
    after?: unknown,
  ) => void;
}
const columns = [
  "firstName",
  "lastName",
  "email",
  "jobTitle",
  "phone1",
  "phone2",
  "whatsappPhone",
  "address",
  "linkedinUrl",
  "instagramUrl",
  "password",
] as const;
const escape = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
async function htmlCards(
  employees: DemoAccount[],
  db: DemoDatabase,
  assetData: ExportContext["assetData"],
) {
  const cards = await Promise.all(
    employees.map(async (e) => {
      const c = db.companies.find((c) => c.id === e.companyId);
      const photo = await assetData(e.photoUrl);
      const logo = await assetData(c?.logoUrl);
      const cover = await assetData(e.cardBackgroundUrl);
      const links = buildViewLinkRows(e)
        .map(
          (link) =>
            `<a href="${escape(link.href)}" target="_blank" rel="noopener noreferrer"><span>${escape(link.label)}</span><b>↗</b></a>`,
        )
        .join("");
      const vcf = `data:text/vcard;charset=utf-8,${encodeURIComponent(buildVcfText({ ...e, companyName: c?.name }, undefined, photo))}`;
      return `<article id="${escape(e.nickname || e.id)}"><div class="cover" style="background-image:url('${cover}')"></div><div class="content"><img class="avatar" src="${photo}" alt="${escape(e.fullName)}"><img class="logo" src="${logo}" alt="${escape(c?.name)}"><p class="company">${escape(c?.name)}</p><h1>${escape(e.fullName)}</h1><h2>${escape(e.jobTitle)}</h2><p>${escape(e.additionalInfo)}</p><a class="save" href="${escape(vcf)}" download="${escape(e.nickname || e.id)}.vcf">Kontaktı Yüklə ↓</a><div class="links">${links}</div><p class="address">${escape(e.address)}</p></div></article>`;
    }),
  );
  return new Blob(
    [
      `<!doctype html><html lang="az"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Demo vizitkartlar</title><style>*{box-sizing:border-box}body{margin:0;background:#edf2f8;color:#18314a;font:15px system-ui}header{text-align:center;padding:32px 16px 12px}header p{color:#60748a}main{display:flex;align-items:flex-start;justify-content:center;flex-wrap:wrap;gap:28px;padding:24px 16px 48px}article{width:100%;max-width:420px;background:white;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px #18314a12}.cover{height:150px;background:#18314a;background-size:cover}.content{padding:0 24px 24px;position:relative}.avatar{width:104px;height:104px;object-fit:cover;border-radius:50%;border:5px solid white;margin-top:-52px}.logo{float:right;width:56px;height:56px;margin-top:16px;border-radius:12px}.company{font-size:12px;color:#6e8398;margin:16px 0 6px}h1{font-size:26px;margin:0 0 6px}h2{font-size:15px;font-weight:500;color:#60748a;margin:0 0 16px}p{line-height:1.65}.save{display:block;background:#1b4a75;color:white;text-align:center;padding:14px;border-radius:12px;text-decoration:none;font-weight:600}.links{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}.links a{display:flex;justify-content:space-between;gap:8px;padding:14px 12px;background:#f1f5f9;border-radius:12px;text-decoration:none;color:inherit;overflow-wrap:anywhere}.links b{color:#1b4a75}.address{font-size:12px;color:#60748a;margin-bottom:0}footer{text-align:center;padding:0 16px 24px;color:#60748a;font-size:12px}</style></head><body><header><strong>SetClapp · Demo vizitkartlar</strong><p>Şəkillər fayla daxildir. Xarici linklər internetlə açılır.</p></header><main>${cards.join("")}</main><footer>Bütün şəxslər və şirkətlər nümayiş üçündür.</footer></body></html>`,
    ],
    { type: "text/html;charset=utf-8" },
  );
}

export async function handleExportImport(
  ctx: ExportContext,
): Promise<Blob | object> {
  const {
    path,
    parts,
    raw,
    db,
    current,
    requireCompany,
    fail,
    audit,
    assetData,
    origin,
  } = ctx;
  if (path.includes("/vcf/")) {
    const e =
      db.employees.find((e) => e.id === parts[2]) ??
      fail("Əməkdaş tapılmadı.", 404);
    if (e.id !== current.id) requireCompany(e.companyId);
    return new Blob([buildVcfText(e, undefined, await assetData(e.photoUrl))], {
      type: "text/vcard;charset=utf-8",
    });
  }
  const template = path.endsWith("/template");
  const importing = path.includes("/import/");
  let selected: DemoAccount[] = [];
  if (!template && !importing) {
    if (Array.isArray(raw)) {
      selected = raw.map(
        (id) =>
          db.employees.find((e) => e.id === id) ??
          fail("Əməkdaş tapılmadı.", 404),
      );
      selected.forEach((e) => requireCompany(e.companyId));
    } else if (parts[2] === "user") {
      const e =
        db.employees.find((e) => e.id === parts[3]) ??
        fail("Əməkdaş tapılmadı.", 404);
      if (e.id !== current.id) requireCompany(e.companyId);
      selected = [e];
    } else {
      requireCompany(parts[2]);
      selected = db.employees.filter((e) => e.companyId === parts[2]);
    }
  }
  if (path.includes("/html/")) return htmlCards(selected, db, assetData);
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "SetClapp Demo";
  if (importing) {
    const cid = parts[3];
    requireCompany(cid);
    const company =
      db.companies.find((c) => c.id === cid) ?? fail("Şirkət tapılmadı.", 404);
    const file = ctx.body instanceof FormData ? ctx.body.get("file") : null;
    if (!(file instanceof File)) fail("Excel faylı seçin.");
    try {
      await workbook.xlsx.load(await (file as File).arrayBuffer());
    } catch {
      return fail("Fayl oxunmadı. İdxal şablonunu XLSX formatında doldurun.");
    }
    const sheet = workbook.worksheets[0];
    if (!sheet) fail("Excel vərəqi boşdur.");
    const headers = new Map<string, number>();
    sheet.getRow(1).eachCell((cell, i) => headers.set(cell.text.trim(), i));
    if (
      !["firstName", "lastName", "email", "jobTitle", "phone1"].every((key) =>
        headers.has(key),
      )
    )
      fail("Sütun adları şablona uyğun deyil. Şablonu yenidən yükləyin.");
    const result = { created: 0, failed: 0, errors: [] as string[] };
    sheet.eachRow((row, index) => {
      if (index === 1 || !row.hasValues) return;
      const data = Object.fromEntries(
        columns.map((key) => [
          key,
          headers.has(key) ? row.getCell(headers.get(key)!).text.trim() : "",
        ]),
      );
      const reason =
        !data.firstName || !data.lastName || !data.jobTitle || !data.phone1
          ? "Ad, soyad, vəzifə və telefon tələb olunur"
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
            ? "E-poçt düzgün deyil"
            : db.employees.some(
                  (e) => e.email.toLowerCase() === data.email.toLowerCase(),
                )
              ? "E-poçt artıq mövcuddur"
              : db.employees.filter((e) => e.companyId === cid).length >=
                  company.userLimit
                ? "Əməkdaş limiti dolub"
                : "";
      if (reason) {
        result.failed++;
        result.errors.push(`Sətir ${index}: ${reason}`);
        return;
      }
      db.employees.push({
        ...data,
        id: crypto.randomUUID(),
        companyId: cid,
        fullName: `${data.firstName} ${data.lastName}`,
        password: data.password || DEMO_PASSWORD,
        role: 2,
        isActive: true,
        canEdit: true,
        photoUrl: "/demo/portraits/person-2.jpg",
        cardBackgroundUrl: "/demo/covers/nova.svg",
      } as DemoAccount);
      result.created++;
    });
    if (result.created)
      audit(cid, "User", "IMPORT", undefined, `${result.created} əməkdaş`);
    return result;
  }
  const sheet = workbook.addWorksheet(
    template ? "İdxal şablonu" : "Əməkdaşlar",
  );
  const exportColumns = template
    ? [...columns]
    : [
        ...columns.filter((key) => key !== "password"),
        "companyName",
        "role",
        "isActive",
        "canEdit",
        "nickname",
        "profileUrl",
        "socialAccounts",
        "contactInfos",
      ];
  sheet.columns = exportColumns.map((key) => ({
    header: key,
    key,
    width: ["email", "profileUrl"].includes(key) ? 42 : 24,
  }));
  if (template)
    sheet.addRow({
      firstName: "Demo",
      lastName: "Əməkdaş",
      email: "new.employee@example.com",
      jobTitle: "Layihə meneceri",
      phone1: "+994505550101",
      password: DEMO_PASSWORD,
    });
  else
    selected.forEach((e) =>
      sheet.addRow({
        ...e,
        companyName: db.companies.find((c) => c.id === e.companyId)?.name,
        role: e.role === 1 ? "Şirkət admini" : "Əməkdaş",
        isActive: e.isActive ? "Aktiv" : "Arxiv",
        canEdit: e.canEdit ? "Bəli" : "Xeyr",
        profileUrl: `${origin}/v/${encodeURIComponent(e.nickname || e.id)}`,
        socialAccounts: JSON.stringify(e.socialAccounts || []),
        contactInfos: JSON.stringify(e.contactInfos || []),
      }),
    );
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1B4A75" },
  };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: exportColumns.length },
  };
  const bytes = await workbook.xlsx.writeBuffer();
  return new Blob([new Uint8Array(bytes)], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
