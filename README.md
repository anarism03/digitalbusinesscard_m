# SetClapp — API-siz demo

Mövcud React + TypeScript vizitkart layihəsinin Vercel üçün hazır mock versiyası. Backend, verilənlər bazası serveri, API açarı və `.env` lazım deyil.

## GitHub → Vercel

1. ZIP-i açın. `business-card-mock` qovluğunun **içindəki faylları** yeni GitHub reposuna yükləyin. Gizli `.gitignore` faylını da saxlayın.
2. Vercel-də **Add New → Project → Import Git Repository** seçin.
3. Framework: **Vite**. Root Directory: `package.json` olan qovluq. Bütün repo bu qovluqdursa `./` saxlayın.
4. Build Command: `npm run build`. Output Directory: `dist`. Install Command: `npm ci`.
5. Node.js: **22.x**. Environment Variables boş qalır. **Deploy** düyməsini basın.

`vercel.json` SPA yönləndirməsini qurur: `/v/aysel-mammadova`, `/admin/statistics` və digər birbaşa keçidlər və səhifə yeniləmələri işləyir. Vercel-in rəsmi təlimatı: https://vercel.com/docs/frameworks/frontend/vite

`node_modules` və `dist` GitHub-a yüklənmir; Vercel bunları özü yaradır. Mövcud production layihəniz əvəzinə yeni repo və yeni Vercel layihəsi istifadə etmək rahatdır.

## Demo girişləri

Giriş səhifəsində ilkin olaraq bağlı olan “Hazır demo hesabları” kartını açıb hər üç rola bir düymə ilə daxil olmaq mümkündür. Sağdakı ox kartla birlikdə animasiya ilə dəyişir. Adi giriş forması da işləyir.

| Rol | E-poçt | Şifrə | Şirkət VÖEN |
| --- | --- | --- | --- |
| Şirkət admini | admin@nova.example.com | Demo123! | 1300000001 |
| Əməkdaş | murad@nova.example.com | Demo123! | 1300000001 |
| Super admin | super@demo.example.com | Demo123! | tələb olunmur |

Super admin üçün adi forma: `/login?mode=super-admin`. Digər şirkətlərin admin e-poçtları şirkət məlumatlarında göstərilir; başlanğıc şifrə eynidir. Atlas Consulting başlanğıcda deaktivdir və super admin panelindən aktivləşdirilə bilər.

## Nələr daxildir?

- 6 uydurma şirkət: Nova Technologies, Caspian Creative, Verde Architecture, Orbit Logistics, Lumina Studio, Atlas Consulting.
- 48 fərqli ad, portret, vəzifə, bioqrafiya, telefon, ünvan və sosial linklə əməkdaş profili; ayrıca super admin hesabı.
- 48 lokal foto, 6 xüsusi SVG loqo, 6 şirkət örtüyü və lokal Poppins şriftləri.
- Şirkət yaratmaq, redaktə etmək, status və limit dəyişmək; yeni şirkətə admin hesabı yaradılır.
- Əməkdaş yaratmaq, profili və şəkilləri redaktə etmək, arxivləşdirmək, redaktə icazəsi və şifrə dəyişmək.
- Unikal profil ləqəbləri, QR, paylaşma, ictimai vizitkartlar və VCF kontakt yükləməsi.
- Son 365 gün üçün 7 mindən çox skan, tarix və əməkdaş filtrləri, qrafiklər, reytinq və audit jurnalı. İctimai karta baxış yeni lokal skan əlavə edir.
- Həqiqi `.xlsx` ixracı, idxal şablonu və `.xlsx` idxalı; təkrar e-poçtlar, limit və məcburi sahələr yoxlanır. Köhnə `.xls` faylını əvvəlcə Excel-də `.xlsx` kimi saxlayın.
- XLSX ixracına vəzifə, əlaqə məlumatları, rol, status, ləqəb, cari domenlə vizitkart linki və sosial linklər daxildir. Şifrələr ixrac edilmir.
- Şəkilləri faylın içinə daxil edilən oflayn HTML vizitkart ixracı. Çoxlu seçim bir HTML faylında ayrıca kartlar kimi verilir.
- Açıq/tünd mövzu və şirkət rəngi sazlamaları; mobil interfeys.

## Lokal işə salmaq

Node.js 22.12+:

```sh
npm ci
npm run dev
```

`http://127.0.0.1:5173` ünvanını açın.

```sh
npm run lint
npm run build
npm run preview
```

## Demo məlumatları necə saxlanır?

Bütün xidmət çağırışları `src/mock/adapter.ts` daxilində lokal cavablandırılır. Köhnə backend-ə sorğu göndərilmir. Statik şəkillər və şriftlər eyni saytdan açılır. Sosial linkə klik etdikdə müvafiq xarici sayt açılır.

Məlumatlar `localStorage` daxilində saxlanır. Eyni brauzerdə yeniləmədən sonra dəyişikliklər qalır və eyni domenin tabları saxlanan məlumatları görür. **Başqa cihaz və ya brauzer öz başlanğıc demo məlumatını görür.** Yeni yaradılan əməkdaş, yeni ləqəb, rəng və redaktələr başqa istifadəçiyə ötürülmür. Bütün cihazlarda dəyişikliklərin paylaşılması üçün backend lazımdır.

İstənilən an “Demo · Hesabı dəyiş” düyməsindən giriş səhifəsinə qayıdın. Giriş səhifəsində “Sıfırla” demo dəyişikliklərini, girişi və görünüş seçimlərini bu brauzerdə təmizləyir. Şifrə dəyişdirmisinizsə hazır giriş düymələri əvvəlki şifrə ilə daxil ola bilməyəcək: yeni şifrəni adi formada yazın və ya demonu sıfırlayın.

Bütün adlar, şirkətlər və əlaqə məlumatları nümayiş üçündür. E-poçtlar rezerv `example.com` domenindədir. Sosial linklər platformaların əsas səhifəsinə, portfolio linkləri `example.com` ünvanına gedir. Portretlər uydurma profilləri təsvir etmək üçün stock fotolardır; həmin şəxslərin real kimliyini ifadə etmir. Mənbələr: `public/demo/ASSETS.md`.

## Kod xəritəsi

- `src/mock/seed.ts`: ilkin şirkətlər, əməkdaşlar, hesablar, skanlar və audit məlumatları.
- `src/mock/database.ts`: brauzerdə saxlama və sıfırlama.
- `src/mock/adapter.ts`: lokal CRUD, rollar, ləqəblər və statistika.
- `src/mock/exports.ts`: Excel idxal/ixracı, HTML və VCF.
- `src/mock/DemoAccess.tsx`: demo giriş düymələri.
- `public/demo/`: lokal şəkillər, loqolar və örtüklər.
- `vercel.json`: Vercel build və SPA yönləndirməsi.

Bu paket açıq nümayiş üçündür; demo girişləri hamıya məlumdur və brauzerdəki rollar real təhlükəsizlik sərhədi deyil.
