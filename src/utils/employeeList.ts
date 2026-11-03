import type { Employee, EmployeeStatusTab } from "../types";

export function applyEmployeeStatuses(
  employees: Employee[],
  overrides: Record<string, boolean>,
): Employee[] {
  return employees.map((employee) => {
    const isActive = overrides[employee.id];
    return isActive === undefined || isActive === employee.isActive
      ? employee
      : { ...employee, isActive };
  });
}

export function filterEmployees(
  employees: Employee[],
  tab: EmployeeStatusTab,
  search: string,
  currentUserId?: string,
): Employee[] {
  const query = search.trim().toLowerCase();
  return employees
    .filter((employee) => {
      if (employee.isActive !== (tab === "active")) return false;
      return (
        !query ||
        employee.fullName.toLowerCase().includes(query) ||
        (employee.jobTitle ?? "").toLowerCase().includes(query)
      );
    })
    .sort((first, second) => {
      if (first.id === currentUserId) return -1;
      if (second.id === currentUserId) return 1;
      return 0;
    });
}
