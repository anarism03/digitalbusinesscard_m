import {
  AxiosError,
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from "axios";
import { decodeJwt } from "../utils/jwt";
import { nicknameSchema } from "../validators/nickname";
import { readDatabase, writeDatabase } from "./database";
import { DEMO_PASSWORD, type DemoAccount, type DemoDatabase } from "./seed";

type Fields = Record<string, unknown>;
const clean = (user: DemoAccount) => {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => key !== "password"),
  );
};
const enriched = (db: DemoDatabase, user: DemoAccount) => {
  const c = db.companies.find((c) => c.id === user.companyId);
  return { ...clean(user), companyName: c?.name, companyLogoUrl: c?.logoUrl };
};
const companyView = (db: DemoDatabase, id: string) => {
  const c = db.companies.find((c) => c.id === id);
  return c
    ? { ...c, usedCount: db.employees.filter((e) => e.companyId === id).length }
    : undefined;
};
function tokenFor(user: DemoAccount) {
  const encode = (value: unknown) =>
    btoa(
      String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value))),
    )
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode({ sub: user.id, email: user.email, name: user.fullName, role: user.role, companyId: user.companyId, canEdit: user.canEdit, exp: Math.floor(Date.now() / 1000) + 86400 })}.demo`;
}
function page<T>(items: T[], params: Fields) {
  const p = Math.max(1, Number(params.page) || 1);
  const size = Math.min(1000, Math.max(1, Number(params.pageSize) || 20));
  return {
    items: items.slice((p - 1) * size, p * size),
    totalCount: items.length,
    page: p,
    pageSize: size,
  };
}
const editable = [
  "firstName",
  "lastName",
  "middleName",
  "jobTitle",
  "phone1",
  "phone2",
  "whatsappPhone",
  "extensionNumber",
  "additionalInfo",
  "photoUrl",
  "googleMapsUrl",
  "cardBackgroundUrl",
  "address",
  "birthday",
  "linkedinUrl",
  "facebookUrl",
  "instagramUrl",
  "socialAccounts",
  "contactInfos",
];

export const mockAdapter: AxiosAdapter = async (
  config: InternalAxiosRequestConfig,
) => {
  const db = readDatabase();
  const path = new URL(
    config.url || "/",
    window.location.origin,
  ).pathname.replace(/^\/api(?=\/)/i, "");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  const lower = path.toLowerCase();
  const method = config.method?.toUpperCase() || "GET";
  const params: Fields = config.params || {};
  const raw: unknown =
    typeof config.data === "string" ? JSON.parse(config.data) : config.data;
  const body =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Fields)
      : {};
  const respond = (data: unknown, status = 200) => ({
    data,
    status,
    statusText: "OK",
    headers: {},
    config,
  });
  const fail = (message: string, status = 400): never => {
    throw new AxiosError(message, String(status), config, undefined, {
      ...respond({ message }, status),
      statusText: message,
    });
  };
  const auth = config.headers.get("Authorization");
  const identity =
    typeof auth === "string" ? decodeJwt(auth.replace(/^Bearer /, "")) : null;
  const actor = db.employees.find((e) => e.id === identity?.id);
  const requireActor = () => {
    if (
      !actor ||
      !actor.isActive ||
      (actor.companyId &&
        !db.companies.find((c) => c.id === actor.companyId)?.isActive)
    )
      fail("Demo hesabı aktiv deyil. Yenidən daxil olun.", 401);
    return actor!;
  };
  const requireSuper = () => {
    if (requireActor().role !== 0)
      fail("Bu əməliyyat üçün icazəniz yoxdur.", 403);
  };
  const requireCompany = (id: string) => {
    const a = requireActor();
    if (a.role !== 0 && (a.role !== 1 || a.companyId !== id))
      fail("Şirkətə giriş icazəsi yoxdur.", 403);
  };
  const findEmployee = (id: string) =>
    db.employees.find((e) => e.id === id) ?? fail("Əməkdaş tapılmadı.", 404);
  const audit = (
    entityId: string,
    entityType: string,
    action: string,
    before?: unknown,
    after?: unknown,
  ) => {
    db.audit.unshift({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      userId: actor?.id,
      userEmail: actor?.email,
      userName: actor?.fullName,
      entityId,
      entityType,
      action,
      changes: [
        {
          label: entityType === "Company" ? "Şirkət" : "Məlumat",
          from: before === undefined ? undefined : JSON.stringify(before),
          to: after === undefined ? undefined : JSON.stringify(after),
        },
      ],
    });
    writeDatabase(db);
  };

  if (lower === "/auth/login" && method === "POST") {
    const user = db.employees.find(
      (e) => e.email.toLowerCase() === String(body.email).trim().toLowerCase(),
    );
    if (!user || user.password !== body.password)
      fail("E-poçt və ya şifrə yanlışdır.", 401);
    if (!user!.isActive) fail("Hesab deaktiv edilib.", 403);
    if (user!.role !== 0) {
      const c = db.companies.find((c) => c.id === user!.companyId);
      if (String(body.companyVoen) !== c?.voen)
        fail("Şirkət VÖEN-i yanlışdır.");
      if (!c?.isActive) fail("Şirkət deaktiv edilib.", 403);
    }
    return respond({
      accessToken: tokenFor(user!),
      isFirstLogin: false,
      daysUntilPasswordExpiry: 365,
    });
  }
  if (parts[0]?.toLowerCase() === "cards" && method === "GET") {
    const identifier = parts[1]?.toLowerCase();
    const e = db.employees.find(
      (e) => e.id === identifier || e.nickname === identifier,
    );
    if (!e || e.role === 0) fail("Vizitkart tapılmadı.", 404);
    if (
      !e!.isActive ||
      !db.companies.find((c) => c.id === e!.companyId)?.isActive
    )
      fail("Vizitkart deaktiv edilib.", 403);
    db.scans.push({
      id: crypto.randomUUID(),
      employeeId: e!.id,
      scannedAt: new Date().toISOString(),
      source: String(params.source || "link"),
    });
    writeDatabase(db);
    return respond(enriched(db, e!));
  }
  const current = requireActor();
  if (lower === "/auth/account-info")
    return respond({
      ...enriched(db, current),
      isFirstLogin: false,
      daysUntilPasswordExpiry: 365,
    });
  if (lower === "/auth/change-password") {
    if (body.oldPassword !== current.password) fail("Köhnə şifrə yanlışdır.");
    if (String(body.newPassword || "").length < 6)
      fail("Şifrə ən azı 6 simvol olmalıdır.");
    current.password = String(body.newPassword);
    audit(current.id, "User", "UPDATE");
    return respond({ success: true });
  }
  if (lower.startsWith("/superadmin")) {
    requireSuper();
    if (lower === "/superadmin/dashboard")
      return respond({
        companiesCount: db.companies.length,
        activeCompaniesCount: db.companies.filter((c) => c.isActive).length,
        inactiveCompaniesCount: db.companies.filter((c) => !c.isActive).length,
        recentCompanies: db.companies
          .slice(-6)
          .reverse()
          .map((c) => companyView(db, c.id)),
        topCompaniesByScans: db.companies
          .map((c) => ({
            companyId: c.id,
            companyName: c.name,
            logoUrl: c.logoUrl,
            isActive: c.isActive,
            scanCount: db.scans.filter(
              (s) =>
                db.employees.find((e) => e.id === s.employeeId)?.companyId ===
                c.id,
            ).length,
          }))
          .sort((a, b) => b.scanCount - a.scanCount),
      });
    if (parts.length === 2 && method === "GET")
      return respond(
        page(
          db.companies.map((c) => companyView(db, c.id)),
          params,
        ),
      );
    if (parts.length === 2 && method === "POST") {
      if (!String(body.name || "").trim()) fail("Şirkət adı tələb olunur.");
      const voen = String(body.voen || "");
      if (db.companies.some((c) => c.voen === voen))
        fail("Bu VÖEN artıq mövcuddur.", 409);
      const id = crypto.randomUUID();
      const email = `admin.${voen}@demo.example.com`;
      const c = {
        id,
        name: String(body.name),
        voen,
        address: String(body.address || ""),
        email: String(body.email || ""),
        phone: String(body.phone || ""),
        logoUrl: String(body.logoUrl || "/demo/logos/nova.svg"),
        userLimit: Math.max(1, Number(body.userLimit) || 20),
        isActive: true,
        adminEmail: email,
      };
      db.companies.push(c);
      db.employees.push({
        id: crypto.randomUUID(),
        companyId: id,
        firstName: c.name,
        lastName: "Admin",
        fullName: `${c.name} Admin`,
        email,
        password: DEMO_PASSWORD,
        role: 1,
        jobTitle: "Şirkət administratoru",
        isActive: true,
        canEdit: true,
        photoUrl: "/demo/portraits/person-1.jpg",
        cardBackgroundUrl: "/demo/covers/nova.svg",
      });
      audit(id, "Company", "CREATE", undefined, c.name);
      return respond({
        company: companyView(db, id),
        adminEmail: email,
        defaultPassword: DEMO_PASSWORD,
        voen,
      });
    }
    const c =
      db.companies.find((c) => c.id === parts[2]) ??
      fail("Şirkət tapılmadı.", 404);
    if (method === "GET") return respond(companyView(db, c.id));
    if (parts[3] === "active")
      c.isActive = params.isActive === true || params.isActive === "true";
    else if (parts[3] === "limit") {
      const limit = Number(raw);
      if (
        !Number.isInteger(limit) ||
        limit < (companyView(db, c.id)?.usedCount || 0)
      )
        fail("Limit əməkdaş sayından az ola bilməz.");
      c.userLimit = limit;
    } else {
      if (
        body.voen &&
        db.companies.some(
          (other) => other.id !== c.id && other.voen === body.voen,
        )
      )
        fail("Bu VÖEN artıq mövcuddur.", 409);
      for (const key of [
        "name",
        "voen",
        "address",
        "email",
        "phone",
        "logoUrl",
        "userLimit",
      ] as const)
        if (key in body) Object.assign(c, { [key]: body[key] });
    }
    audit(c.id, "Company", "UPDATE", undefined, c.name);
    return respond(companyView(db, c.id));
  }
  if (lower === "/companyadmin/company") {
    requireCompany(current.companyId);
    const c =
      db.companies.find((c) => c.id === current.companyId) ??
      fail("Şirkət tapılmadı.", 404);
    if (method === "PUT") {
      for (const key of [
        "name",
        "address",
        "email",
        "phone",
        "logoUrl",
      ] as const)
        if (key in body) Object.assign(c, { [key]: body[key] });
      audit(c.id, "Company", "UPDATE", undefined, c.name);
    }
    return respond(companyView(db, c.id));
  }
  if (lower.startsWith("/companyadmin/users/company/")) {
    requireCompany(parts[3]);
    return respond(
      page(
        db.employees
          .filter((e) => e.companyId === parts[3])
          .map((e) => enriched(db, e)),
        params,
      ),
    );
  }
  if (lower === "/companyadmin/users" && method === "POST") {
    const cid = String(body.companyId);
    requireCompany(cid);
    const c = companyView(db, cid) ?? fail("Şirkət tapılmadı.", 404);
    if ((c.usedCount || 0) >= c.userLimit) fail("Əməkdaş limitinə çatmısınız.");
    if (
      db.employees.some(
        (e) => e.email.toLowerCase() === String(body.email).toLowerCase(),
      )
    )
      fail("Bu e-poçt artıq mövcuddur.", 409);
    if (!body.firstName || !body.lastName || !body.email)
      fail("Ad, soyad və e-poçt tələb olunur.");
    const e = {
      ...body,
      id: crypto.randomUUID(),
      companyId: cid,
      fullName: `${body.firstName} ${body.lastName}`,
      password: String(body.password || DEMO_PASSWORD),
      role: Number(body.role) === 1 ? 1 : 2,
      isActive: body.isActive !== false,
      canEdit: true,
      photoUrl: "/demo/portraits/person-2.jpg",
      cardBackgroundUrl: "/demo/covers/nova.svg",
    } as DemoAccount;
    db.employees.push(e);
    audit(e.id, "User", "CREATE", undefined, e.fullName);
    return respond(enriched(db, e));
  }
  if (lower.startsWith("/user/") || lower.startsWith("/companyadmin/users/")) {
    const own = parts[1]?.toLowerCase() === "profile";
    const e = findEmployee(
      own
        ? current.id
        : parts[0].toLowerCase() === "user"
          ? parts[1]
          : parts[2],
    );
    if (lower.startsWith("/companyadmin/") || e.id !== current.id)
      requireCompany(e.companyId);
    if (method === "GET") return respond(enriched(db, e));
    if (own && current.role === 2 && !current.canEdit)
      fail("Profil redaktəsinə icazə yoxdur.", 403);
    const operation = parts[parts.length - 1].toLowerCase();
    if (operation === "active") {
      requireCompany(e.companyId);
      const active = params.isActive === true || params.isActive === "true";
      e.isActive = active;
    } else if (operation === "canedit") {
      requireCompany(e.companyId);
      e.canEdit = params.canEdit === true || params.canEdit === "true";
    } else if (operation === "reset-password") {
      requireCompany(e.companyId);
      if (String(body.newPassword || "").length < 6)
        fail("Şifrə ən azı 6 simvol olmalıdır.");
      e.password = String(body.newPassword);
    } else if (operation === "nickname") {
      const parsed = nicknameSchema.safeParse(body.nickname || "");
      if (!parsed.success) fail("Profil linki düzgün deyil.");
      const nick = parsed.success ? parsed.data : "";
      if (
        nick &&
        db.employees.some(
          (other) => other.id !== e.id && other.nickname === nick,
        )
      )
        fail("Bu profil linki artıq istifadə olunur.", 409);
      e.nickname = nick || undefined;
      audit(e.id, "User", "UPDATE", undefined, nick);
      return respond({ id: e.id, nickname: nick || null });
    } else {
      const previous = e.fullName;
      for (const key of editable)
        if (key in body) Object.assign(e, { [key]: body[key] });
      e.fullName = [e.firstName, e.lastName, e.middleName]
        .filter(Boolean)
        .join(" ");
      audit(e.id, "User", "UPDATE", previous, e.fullName);
      return respond(enriched(db, e));
    }
    audit(e.id, "User", "UPDATE");
    return respond(enriched(db, e));
  }
  if (lower.startsWith("/analytics/")) {
    const cid = String(params.companyId || current.companyId);
    requireCompany(cid);
    const scans = db.scans.filter((s) => {
      const e = db.employees.find((e) => e.id === s.employeeId);
      const time = new Date(s.scannedAt).getTime();
      return (
        e?.companyId === cid &&
        (!params.employeeId || s.employeeId === params.employeeId) &&
        (!params.startDate ||
          time >= new Date(String(params.startDate)).getTime()) &&
        (!params.endDate || time <= new Date(String(params.endDate)).getTime())
      );
    });
    if (lower.endsWith("/count")) return respond({ totalScans: scans.length });
    if (lower.endsWith("/chart")) {
      const counts = new Map<string, number>();
      const start = new Date(
        String(
          params.startDate || scans[0]?.scannedAt || new Date().toISOString(),
        ),
      );
      start.setHours(0, 0, 0, 0);
      const end = new Date(String(params.endDate || new Date().toISOString()));
      for (
        const day = new Date(start);
        day <= end && counts.size < 1100;
        day.setDate(day.getDate() + 1)
      )
        counts.set(
          `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`,
          0,
        );
      scans.forEach((s) => {
        const d = new Date(s.scannedAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      });
      return respond(
        [...counts]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, count]) => ({ date, count })),
      );
    }
    if (lower.endsWith("/ranking"))
      return respond(
        db.employees
          .filter(
            (e) =>
              e.companyId === cid &&
              (!params.employeeId || e.id === params.employeeId),
          )
          .map((e) => ({
            employeeId: e.id,
            fullName: e.fullName,
            jobTitle: e.jobTitle,
            photoUrl: e.photoUrl,
            scanCount: scans.filter((s) => s.employeeId === e.id).length,
          }))
          .sort((a, b) => b.scanCount - a.scanCount),
      );
    if (lower.endsWith("/logs"))
      return respond(
        page(
          scans
            .sort((a, b) => b.scannedAt.localeCompare(a.scannedAt))
            .map((s) => {
              const e = findEmployee(s.employeeId);
              return { ...s, employeeName: e.fullName, photoUrl: e.photoUrl };
            }),
          params,
        ),
      );
  }
  if (lower === "/auditlog") {
    requireSuper();
    return respond(page(db.audit, params));
  }
  if (lower.startsWith("/exportimport/")) {
    const { handleExportImport } = await import("./exports");
    return respond(
      await handleExportImport({
        path: lower,
        parts,
        raw,
        body: config.data,
        db,
        current,
        requireCompany,
        fail,
        audit,
      }),
    );
  }
  return fail(`Demo əməliyyatı tapılmadı: ${method} ${path}`, 404);
};
