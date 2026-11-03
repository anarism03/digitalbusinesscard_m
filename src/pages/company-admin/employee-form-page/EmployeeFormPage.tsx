import { Alert, Card } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/shared/PageHeader";
import ErrorState from "../../../components/shared/ErrorState";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";
import { ROLE_TO_NUM } from "../../../constants/roles";
import { strings } from "../../../constants/strings";
import { useMyCompany } from "../../../hooks/useCompanies";
import {
  useCreateEmployee,
  useEmployees,
  useSetEmployeeCanEdit,
} from "../../../hooks/useEmployees";
import { useAppSelector } from "../../../store/hooks";
import { message } from "../../../utils/feedback";
import { mapEmployee } from "../../../utils/mappers";
import type { EmployeeFormValues } from "../../../validators/employee";
import EmployeeForm from "./parts/EmployeeForm";

const TEAM_ROUTE = "/admin/card?context=company&view=team";
const s = strings.employees.form;

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const companyId = useAppSelector((state) => state.auth.user?.companyId) ?? "";

  const createEmployee = useCreateEmployee();
  const setCanEdit = useSetEmployeeCanEdit();

  const companyQuery = useMyCompany();
  const employeesQuery = useEmployees(companyId);
  const { data: company } = companyQuery;
  const { data: employees = [] } = employeesQuery;
  const limitReached =
    company?.userLimit != null &&
    company.userLimit > 0 &&
    employees.length >= company.userLimit;

  const handleSubmit = async (values: EmployeeFormValues) => {
    let newId: string;
    try {
      const created = await createEmployee.mutateAsync({
        ...values,
        companyId,
        middleName: values.middleName || undefined,
        role: ROLE_TO_NUM.EMPLOYEE,
        isActive: true,
      });

      newId = mapEmployee(created).id;
    } catch {
      return;
    }

    if (newId) {
      try {
        await setCanEdit.mutateAsync({ id: newId, canEdit: false });
      } catch {
        message.warning(
          "Əməkdaş yaradıldı, amma redaktə icazəsi yenilənmədi. İcazəni tənzimləmələrdə yoxlayın.",
        );
      }
    }

    navigate(
      newId ? `/admin/card?context=company&employeeId=${newId}` : TEAM_ROUTE,
    );
  };

  return (
    <div>
      <PageHeader title={s.createTitle} back />
      <Card>
        {companyQuery.isError || employeesQuery.isError ? (
          <ErrorState
            onRetry={() => {
              void companyQuery.refetch();
              void employeesQuery.refetch();
            }}
          />
        ) : companyQuery.isLoading || employeesQuery.isLoading ? (
          <LoadingSkeleton />
        ) : limitReached ? (
          <Alert
            type="warning"
            showIcon
            message="Şirkətiniz əməkdaş limitinə çatıb"
            description={`Maksimum: ${company?.userLimit}. Deaktiv əməkdaşlar da limitə daxildir.`}
          />
        ) : (
          <EmployeeForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(TEAM_ROUTE)}
            isLoading={createEmployee.isPending || setCanEdit.isPending}
          />
        )}
      </Card>
    </div>
  );
}
