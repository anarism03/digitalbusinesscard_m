# Yoxlama nəticələri — 3 noyabr 2026

Yerli Windows mühitində Node.js 24.16.0 və Chromium ilə yoxlanıb. Vercel-ə faktiki deploy edilməyib; deploy üçün konfiqurasiya hazırlanıb.

- `npm run build`: uğurlu TypeScript və production build.
- `npm run lint`: xəta və xəbərdarlıq yoxdur.
- Production preview-də 390px mobil görünüş: giriş, şirkət admini, əməkdaş profili, super admin və ictimai kart açılır.
- Girişdə şirkət seçimi: Caspian Creative hesabına giriş işləyir.
- Əməkdaş siyahısı, şirkət sazlamaları, skan loqları, idxal/ixrac və yeni əməkdaş səhifələri açılır.
- 48 portret + 6 loqo + 6 örtük: hamısı brauzerdə uğurla dekod edilir.
- Production səhifələrində API və xarici resurs sorğuları müşahidə edilmədi; səhifə xətası yoxdur.
- Giriş, ictimai vizitkart və əməkdaş profili mobil görünüşdə üfüqi daşma yaratmır.
- Əməkdaş yaratmaq, redaktə, unikal ləqəb, təkrar ləqəbin rəddi, arxiv, redaktə icazəsi və səhifə yenilənməsindən sonra saxlanma yoxlanıb.
- İctimai karta baxış statistikanı artırır; deaktiv və mövcud olmayan kartlar uyğun mesaj göstərir.
- Şirkət yaratmaq avtomatik admin məlumatları qaytarır; redaktə, limit, aktiv/deaktiv və audit qeydləri yoxlanıb.
- Yanlış şifrə və şirkətlərarası icazəsiz giriş rədd edilir.
- XLSX ixracı həqiqi ZIP əsaslı Excel faylıdır; şablon idxalı əməkdaş yaradır, təkrar idxal e-poçt xətası verir.
- HTML ixracına portret və redaktə edilmiş məlumat daxildir; VCF `BEGIN:VCARD` ilə yaranır.
- QR kod görünür və PNG kimi yüklənir.

Excel kitabxanası ayrıca, tələb olunan zaman yüklənən chunk yaradır. Vite onun ölçüsü barədə məlumat xarakterli xəbərdarlıq verir; build uğurludur.
