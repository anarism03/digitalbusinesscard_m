export type CardViewParams = {
  context: "company" | "admin";
  view: "team" | "card";
  employeeId?: string;
  editMode: boolean;
};

export type SearchParamValue = string | number | boolean | null | undefined;
