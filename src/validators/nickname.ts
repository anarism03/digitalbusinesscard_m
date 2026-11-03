import { z } from "zod";

export const NICKNAME_MAX_LENGTH = 30;

export const nicknameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(NICKNAME_MAX_LENGTH, "İstifadəçi adı maksimum 30 simvol ola bilər")
  .refine(
    (value) => !value || value.length >= 3,
    "İstifadəçi adı ən az 3 simvol olmalıdır",
  )
  .refine(
    (value) => !value || /^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/.test(value),
    "Latın hərfləri, rəqəmlər, - və _ istifadə edin; ad hərf və ya rəqəmlə başlayıb bitməlidir",
  );
