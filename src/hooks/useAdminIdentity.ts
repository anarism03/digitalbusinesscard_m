import { useAppSelector } from "../store/hooks";
import { useMyCompany } from "./useCompanies";
import { useEmployee } from "./useEmployees";

export function useAdminIdentity(profileEnabled = true) {
  const user = useAppSelector((state) => state.auth.user);
  const { data: company } = useMyCompany(user?.role === "COMPANY_ADMIN");
  const { data: employee } = useEmployee(user?.id ?? "", profileEnabled);

  const adminName =
    [employee?.fullName, user?.fullName]
      .map((name) => name?.trim())
      .find((name) => name && !/^string(?:\s+string)*$/i.test(name)) ||
    user?.email ||
    "Şirkət Administratoru";

  return {
    company,
    employee,
    adminName,
    adminPhotoUrl: employee ? employee.photoUrl : user?.photoUrl,
    companyName: employee?.companyName || company?.name || "Şirkət",
    companyLogoUrl: company ? company.logoUrl : employee?.companyLogoUrl,
  };
}
