# Ortaq Vercel Blob yaddaşı

Bu versiya şirkətləri, profilləri, mətnləri, linkləri, statistikanı və brend rənglərini private Vercel Blob-da saxlayır. Şəkillər ayrıca Blob obyektləridir. Brauzerdə yalnız giriş sessiyası, açıq/tünd rejim seçimi və son təsdiqlənmiş rəngin keş nüsxəsi qalır.

## Vercel-də qoşmaq

1. `digitalbusinesscard-data` private Blob deposunda **Projects → Connect Project** açın.
2. Saytın deploy olunduğu `digitalbusinesscard` layihəsini seçin. **Production** mühitini qoşun.
3. Layihənin **Settings → Environment Variables** bölməsində bağlantı dəyişənlərini yoxlayın. Standart `BLOB_READ_WRITE_TOKEN` və ya OIDC ilə `BLOB_STORE_ID` dəstəklənir. Panelinizdə göstərilən `BLOB_READ_WRITE_TOKEN_STORE_ID` adı da dəstəklənir. OIDC üçün Vercel-in runtime `VERCEL_OIDC_TOKEN` dəyişəni istifadə edilir.
4. Tokeni koda, GitHub-a və ya çata yazmayın. `VITE_` prefiksi əlavə etməyin.
5. Yeni kodu deploy edin. Bağlantı sonradan əlavə edilibsə **Deployments → Redeploy** edin.
6. `https://digitalbusinesscard-mocha.vercel.app/api/health` ünvanını açın. Düzgün cavab: `{"storage":"vercel-blob","shared":true}`. HTML cavabı köhnə deploy/routing, 503 isə Blob bağlantısı və ya yaddaş xidmətində problem olduğunu göstərir.

İlk uğurlu API sorğusu `state/database-v1.json` faylını yaradır. Mövcud fayl sonrakı deploy-larda sıfırlanmır. Şəkillər `media/` qovluğunda saxlanır. İlkin demo şəkilləri dəyişdirilənədək saytın `public/demo/` fayllarından istifadə edir.

## İki cihazla yoxlamaq

1. Hər iki cihazda səhifəni yeniləyin və yenidən daxil olun. Köhnə lokal demo sessiyaları yeni server sessiyası kimi qəbul edilmir.
2. Telefonda profili redaktə edib **Yadda saxla** basın. Uğurlu saxlama bildirişini gözləyin.
3. PC-də eyni profili və ya ictimai kart linkini yeniləyin. Mətn və şəkil eyni olmalıdır.
4. Açıq səhifələrə qayıdanda məlumatlar yenidən oxunur. Davamlı realtime bağlantı yoxdur; yeniləmə düyməsi həmişə son saxlanan məlumatı oxuyur.

Əvvəlki `setclapp-demo-db-v1` lokal məlumatı avtomatik ortaq yaddaşa köçürülmür və silinmir. Köhnə cihaz nüsxələrinin yeni ortaq məlumatları təsadüfən əvəz etməməsi üçün avtomatik import edilmir. Əvvəlki lokal redaktələri ortaq versiyada yenidən yadda saxlamaq lazımdır.

“Girişi təmizlə” yalnız həmin cihazın sessiyasını təmizləyir. Ortaq məlumatları sıfırlamır.

## Lokal iş və test

Cloud bağlantısı ilə lokal iş üçün ayrı development Blob deposu qoşun və Vercel CLI ilə `.env.local` faylına development dəyişənlərini götürün. Sonra:

```sh
npm ci
npm run dev
```

Production kodunda lokal yaddaşa avtomatik keçid yoxdur. Blob işləmirsə API 503 qaytarır.

İnteqrasiya testləri təcrid olunmuş yaddaş sürücüsü ilə işləyir, production Blob-a yazmır:

```sh
npm test
npm run lint
npm run build
```

Brauzer testləri üçün PowerShell-də yalnız lokal prosesə aid test yaddaşı açmaq olar:

```powershell
$env:BLOB_TEST_MODE = '1'
npm run dev -- --port 5187 --strictPort
```

Bu test yaddaşı proses dayanan kimi itir; `api/index.ts` production entry point-i bu rejimi istifadə etmir.

## Saxlama və icazələr

- JSON faylı yalnız serverdə oxunur. API bütün bazanı və şifrə hash-lərini brauzerə qaytarmır.
- Şifrələr scrypt hash kimi saxlanır, giriş tokenləri serverdə HMAC ilə imzalanır.
- Yazılar əvvəlki ETag ilə şərti saxlanır; paralel dəyişiklik olduqda son versiya yenidən oxunur və əməliyyat təkrar edilir.
- Dəyişən JSON CDN keşindən deyil, origin-dən oxunur. API cavabları `no-store` istifadə edir.
- Şəkillər eyni private depodan API vasitəsilə təqdim edilir. Yalnız profildə/şirkətdə istifadə edilən və baxışa icazə verilən şəkillər göstərilir; JSON faylları media endpoint-i ilə açılmır.
- Demo hesablarının girişləri README-də açıq göstərilir. Bu versiya ortaq nümayiş üçündür; şəxsi hesablarla istifadəyə keçəndə demo girişlərini və məlum demo şifrələrini dəyişin.
