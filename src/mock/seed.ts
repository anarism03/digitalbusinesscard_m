import type { Company, Employee, AuditLogEntry } from "../types/index.js";

export const DEMO_PASSWORD = "Demo123!";
export const DATABASE_KEY = "setclapp-demo-db-v1";
export const AUTH_KEY = "setclapp-demo-auth-v1";
export const companyId = (i: number) =>
  `10000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;
export const employeeId = (i: number) =>
  `20000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`;

const brands = [
  [
    "Nova Technologies",
    "nova",
    "Rəqəmsal məhsullar və proqram təminatı",
    "Nizami küçəsi 203B, Bakı",
  ],
  [
    "Caspian Creative",
    "caspian",
    "Brend strategiyası və yaradıcı dizayn",
    "Xəqani küçəsi 27, Bakı",
  ],
  [
    "Verde Architecture",
    "verde",
    "Memarlıq və davamlı şəhər həlləri",
    "Ağ Şəhər, Yaşıl Ada küçəsi 12, Bakı",
  ],
  [
    "Orbit Logistics",
    "orbit",
    "Beynəlxalq logistika və təchizat",
    "Heydər Əliyev prospekti 115, Bakı",
  ],
  [
    "Lumina Studio",
    "lumina",
    "Fotoqrafiya və vizual kommunikasiya",
    "İçərişəhər, Kiçik Qala küçəsi 18, Bakı",
  ],
  [
    "Atlas Consulting",
    "atlas",
    "Biznes məsləhətçiliyi və inkişaf",
    "Neftçilər prospekti 153, Bakı",
  ],
];
const people = [
  ["Aysel", "Məmmədova", "aysel-mammadova", "İcraçı direktor"],
  ["Murad", "Əliyev", "murad-aliyev", "Baş proqram mühəndisi"],
  ["Nigar", "Həsənova", "nigar-hasanova", "Məhsul dizayneri"],
  ["Elvin", "Quliyev", "elvin-quliyev", "Məhsul meneceri"],
  ["Leyla", "Abbasova", "leyla-abbasova", "Marketinq rəhbəri"],
  ["Orxan", "İsmayılov", "orxan-ismayilov", "Satış üzrə menecer"],
  ["Fidan", "Rzayeva", "fidan-rzayeva", "İnsan resursları üzrə mütəxəssis"],
  ["Tural", "Hüseynov", "tural-huseynov", "Maliyyə analitiki"],
  ["Günel", "Əhmədova", "gunel-ahmadova", "Kreativ direktor"],
  ["Rəşad", "Babayev", "rashad-babayev", "Brend strateqi"],
  ["Səbinə", "Cəfərova", "sabina-jafarova", "Qrafik dizayner"],
  ["Kənan", "Səfərov", "kanan-safarov", "Art direktor"],
  ["Ləman", "İbrahimova", "laman-ibrahimova", "Kontent meneceri"],
  ["Emin", "Vəliyev", "emin-valiyev", "Video prodüser"],
  [
    "Aytən",
    "Süleymanova",
    "aytan-suleymanova",
    "İctimaiyyətlə əlaqələr meneceri",
  ],
  ["Cavid", "Nəsirov", "javid-nasirov", "Layihə koordinatoru"],
  ["Sevinc", "Qasımova", "sevinj-qasimova", "Mütəxəssis"],
  ["Fərid", "Məlikov", "farid-malikov", "Mütəxəssis"],
  ["Zəhra", "Mustafayeva", "zahra-mustafayeva", "Mütəxəssis"],
  ["Ramin", "Hacıyev", "ramin-hajiyev", "Mütəxəssis"],
  ["İlahə", "Məmmədli", "ilaha-mammadli", "Mütəxəssis"],
  ["Nicat", "Ələkbərov", "nijat-alakbarov", "Mütəxəssis"],
  ["Dilarə", "Əliyeva", "dilara-aliyeva", "Mütəxəssis"],
  ["Kamran", "Qurbanov", "kamran-qurbanov", "Mütəxəssis"],
  ["Afaq", "Şükürova", "afaq-shukurova", "Mütəxəssis"],
  ["Anar", "Kərimov", "anar-karimov", "Mütəxəssis"],
  ["Səma", "Məmmədzadə", "sama-mammadzada", "Mütəxəssis"],
  ["Vüsal", "Orucov", "vusal-orujov", "Mütəxəssis"],
  ["Rəna", "Qasımzadə", "rana-qasimzada", "Mütəxəssis"],
  ["Fuad", "İsmayılzadə", "fuad-ismayilzada", "Mütəxəssis"],
  ["Jalə", "Mirzəyeva", "jala-mirzayeva", "Mütəxəssis"],
  ["Samir", "Talıbov", "samir-talibov", "Mütəxəssis"],
  ["Ayan", "Hüseynli", "ayan-huseynli", "Mütəxəssis"],
  ["Sənan", "Rüstəmov", "sanan-rustamov", "Mütəxəssis"],
  ["Mələk", "Tağıyeva", "malak-taghiyeva", "Mütəxəssis"],
  ["İlkin", "Kazımov", "ilkin-kazimov", "Mütəxəssis"],
  ["Pərvin", "Sadiqova", "parvin-sadiqova", "Mütəxəssis"],
  ["Rauf", "Əsgərov", "rauf-asgarov", "Mütəxəssis"],
  ["Xədicə", "Məmmədova", "khadija-mammadova", "Mütəxəssis"],
  ["Əli", "Sultanov", "ali-sultanov", "Mütəxəssis"],
  ["Nuray", "Rəhimova", "nuray-rahimova", "Mütəxəssis"],
  ["Elnur", "Mehdiyev", "elnur-mehdiyev", "Mütəxəssis"],
  ["Səidə", "Ağayeva", "saida-agayeva", "Mütəxəssis"],
  ["Ruslan", "Əhmədov", "ruslan-ahmadov", "Mütəxəssis"],
  ["Nərmin", "Səlimova", "narmin-salimova", "Mütəxəssis"],
  ["Tofiq", "Qədirov", "tofig-gadirov", "Mütəxəssis"],
  ["Lalə", "Fərzəliyeva", "lala-farzaliyeva", "Mütəxəssis"],
  ["Ceyhun", "Zeynalov", "jeyhun-zeynalov", "Mütəxəssis"],
];
const titles = [
  [
    "Baş memar",
    "Memar",
    "İnteryer dizayneri",
    "Layihə rəhbəri",
    "Landşaft memarı",
    "BIM mütəxəssisi",
    "Şəhərsalma mütəxəssisi",
    "Tikinti mühəndisi",
  ],
  [
    "Əməliyyatlar direktoru",
    "Logistika meneceri",
    "Təchizat mütəxəssisi",
    "Nəqliyyat koordinatoru",
    "Gömrük mütəxəssisi",
    "Anbar müdiri",
    "Müştəri əlaqələri meneceri",
    "Maliyyə analitiki",
  ],
  [
    "Studiya rəhbəri",
    "Fotoqraf",
    "Vizual dizayner",
    "Videoqraf",
    "Prodüser",
    "Montaj mütəxəssisi",
    "Sosial media meneceri",
    "Layihə koordinatoru",
  ],
  [
    "İdarəedici tərəfdaş",
    "Biznes analitiki",
    "Strategiya məsləhətçisi",
    "Layihə meneceri",
    "Marketinq məsləhətçisi",
    "Satış məsləhətçisi",
    "İnsan resursları məsləhətçisi",
    "Maliyyə məsləhətçisi",
  ],
];

export interface DemoAccount extends Employee {
  password: string;
}
export interface DemoScan {
  id: string;
  employeeId: string;
  scannedAt: string;
  source: string;
}
export interface DemoDatabase {
  version: 1;
  companies: Company[];
  employees: DemoAccount[];
  scans: DemoScan[];
  audit: AuditLogEntry[];
}

export function createSeed(): DemoDatabase {
  const companies: Company[] = brands.map(([name, slug, , address], i) => ({
    id: companyId(i),
    name,
    voen: String(1300000001 + i),
    logoUrl: `/demo/logos/${slug}.svg`,
    address,
    email: `hello@${slug}.example.com`,
    phone: `+9941255501${String(i).padStart(2, "0")}`,
    userLimit: [50, 30, 25, 40, 20, 35][i],
    isActive: i !== 5,
    adminEmail:
      i === 0
        ? "admin@nova.example.com"
        : `${people[(i * 2) % people.length][2]}@${slug}.example.com`,
  }));
  const employees: DemoAccount[] = brands.flatMap(
    ([name, slug, sector, address], c) =>
      Array.from({ length: 8 }, (_, j) => {
        const i = c * 8 + j;
        const [firstName, lastName, nickname, jobTitle] =
          people[i % people.length];
        const handle = c < 2 ? nickname : `${nickname}-${slug}`;
        return {
          id: employeeId(i),
          companyId: companyId(c),
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          jobTitle: c < 2 ? jobTitle : titles[c - 2][j],
          email:
            i === 0
              ? "admin@nova.example.com"
              : i === 1
                ? "murad@nova.example.com"
                : `${handle}@${slug}.example.com`,
          password: DEMO_PASSWORD,
          role: j === 0 ? 1 : 2,
          isActive: j !== 7,
          canEdit: j !== 6,
          nickname: handle,
          photoUrl: `/demo/portraits/person-${i + 1}.jpg`,
          cardBackgroundUrl: `/demo/covers/${slug}.svg`,
          companyName: name,
          companyLogoUrl: `/demo/logos/${slug}.svg`,
          phone1: `+99412555${String(1000 + i)}`,
          phone2: `+99450555${String(1000 + i)}`,
          whatsappPhone: `+99450555${String(1000 + i)}`,
          extensionNumber: String(101 + j),
          address,
          birthday: `199${i % 8}-0${(i % 9) + 1}-${String((i % 27) + 1).padStart(2, "0")}`,
          additionalInfo:
            `${sector}. ${name} komandasında keyfiyyətli həllər yaradıram. Əməkdaşlıq üçün mənimlə əlaqə saxlayın.`.slice(
              0,
              150,
            ),
          linkedinUrl: "https://www.linkedin.com/",
          instagramUrl: "https://www.instagram.com/",
          facebookUrl: "https://www.facebook.com/",
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
          socialAccounts: [
            {
              platformName: "website::Şirkət haqqında",
              profileUrl: `https://example.com/#${slug}`,
            },
            {
              platformName: "website::Portfolio və layihələr",
              profileUrl: `https://example.com/#${slug}-portfolio`,
            },
            ...(c === 0
              ? [{ platformName: "github", profileUrl: "https://github.com/" }]
              : []),
            { platformName: "youtube", profileUrl: "https://www.youtube.com/" },
          ],
          contactInfos: [
            {
              contactType: "contact-card:buttonLabel",
              value: "Kontaktı Yüklə",
            },
            {
              contactType: "contact-card:name",
              value: `${firstName} ${lastName}`,
            },
            {
              contactType: "contact-card:website",
              value: `https://example.com/#${slug}`,
            },
            {
              contactType: "email",
              value: `team@${slug}.example.com`,
              label: "Komanda ilə əlaqə",
            },
          ],
        };
      }),
  );
  companies.forEach((c) => {
    c.adminEmail = employees.find(
      (e) => e.companyId === c.id && e.role === 1,
    )?.email;
  });
  employees.push({
    ...employees[0],
    id: "30000000-0000-4000-8000-000000000001",
    companyId: "",
    email: "super@demo.example.com",
    role: 0,
    firstName: "Demo",
    lastName: "Administrator",
    fullName: "Demo Administrator",
    nickname: undefined,
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const scans: DemoScan[] = [];
  for (let day = 364; day >= 0; day--) {
    for (let c = 0; c < 6; c++) {
      const count = 1 + ((day * 7 + c * 11) % 6);
      for (let n = 0; n < count; n++) {
        const d = new Date(today);
        d.setDate(d.getDate() - day);
        d.setHours(day === 0 ? 0 : 8 + (n % 11), (n * 13) % 60);
        if (d.getTime() > Date.now()) continue;
        scans.push({
          id: `seed-${day}-${c}-${n}`,
          employeeId: employeeId(c * 8 + ((n * 3 + day) % 7)),
          scannedAt: d.toISOString(),
          source: n % 3 ? "qr" : "link",
        });
      }
    }
  }
  const audit: AuditLogEntry[] = employees.slice(0, 24).map((e, i) => ({
    id: `audit-${i}`,
    createdAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(),
    userId: employees[0].id,
    userEmail: employees[0].email,
    userName: employees[0].fullName,
    action: i % 3 === 0 ? "CREATE" : "UPDATE",
    entityType: "User",
    entityId: e.id,
    changes: [
      { label: "Əməkdaş", to: e.fullName },
      {
        label: "Vəzifə",
        from: i % 3 ? "Mütəxəssis" : undefined,
        to: e.jobTitle,
      },
    ],
  }));
  return { version: 1, companies, employees, scans, audit };
}
