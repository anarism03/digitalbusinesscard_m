import { useState } from "react";
import { Alert, Button, Popconfirm, Select, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { setCredentials } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks";
import { decodeJwt } from "../utils/jwt";
import { getApiErrorMessage } from "../utils/apiError";
import { readDatabase, resetDemo } from "./database";
import { companyId, DEMO_PASSWORD } from "./seed";

export default function DemoAccess() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [pending, setPending] = useState<string>();
  const [error, setError] = useState<string>();
  const [db] = useState(readDatabase);
  const [selectedCompany, setSelectedCompany] = useState(companyId(0));
  const company = db.companies.find((c) => c.id === selectedCompany);
  const admin = db.employees.find(
    (e) => e.companyId === selectedCompany && e.role === 1 && e.isActive,
  );
  const employee = db.employees.find(
    (e) => e.companyId === selectedCompany && e.role === 2 && e.isActive,
  );
  async function enter(email: string) {
    setPending(email);
    setError(undefined);
    try {
      const result = await authService.login({
        email,
        password: DEMO_PASSWORD,
        ...(email.startsWith("super@") ? {} : { companyVoen: company?.voen }),
      });
      const user = decodeJwt(result.accessToken);
      if (!user) throw new Error("Demo girişi alınmadı");
      dispatch(setCredentials({ user, token: result.accessToken }));
      navigate(
        user.role === "SUPER_ADMIN"
          ? "/super-admin/dashboard"
          : user.role === "COMPANY_ADMIN"
            ? "/admin/statistics"
            : "/employee/profile",
      );
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setPending(undefined);
    }
  }
  return (
    <section
      aria-label="Demo girişləri"
      style={{
        background: "var(--color-surface)",
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        border: "1px solid var(--color-primary-soft)",
      }}
    >
      <strong style={{ color: "var(--color-primary)", fontSize: 15 }}>
        Hazır demo hesabları
      </strong>
      <p
        style={{
          margin: "6px 0 12px",
          fontSize: 12,
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
        }}
      >
        6 şirkət · 48 profil · API-siz demo
        <br />
        Şəxslər və şirkətlər uydurmadır. Dəyişikliklər bu brauzerdə saxlanır.
      </p>
      <Select
        aria-label="Demo şirkətini seçin"
        value={selectedCompany}
        onChange={setSelectedCompany}
        style={{ width: "100%", marginBottom: 12 }}
        options={db.companies.map((c) => ({
          value: c.id,
          label: c.name + (c.isActive ? "" : " · deaktiv"),
          disabled: !c.isActive,
        }))}
      />
      <Space wrap size={8}>
        {[
          ["Şirkət admini", admin?.email || ""],
          ["Əməkdaş", employee?.email || ""],
          ["Super admin", "super@demo.example.com"],
        ].map(([label, email]) => (
          <Button
            key={email}
            size="small"
            loading={pending === email}
            disabled={!email || (!!pending && pending !== email)}
            onClick={() => void enter(email)}
          >
            {label}
          </Button>
        ))}
      </Space>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
          marginTop: 12,
          fontSize: 12,
        }}
      >
        <Link to="/v/aysel-mammadova">Nümunə vizitkarta bax ↗</Link>
        <Popconfirm
          title="Demo məlumatları sıfırlansın?"
          description="Bu brauzerdə etdiyiniz demo dəyişiklikləri silinəcək."
          onConfirm={resetDemo}
          okText="Sıfırla"
          cancelText="Ləğv et"
        >
          <button
            type="button"
            style={{
              border: 0,
              background: "none",
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Sıfırla
          </button>
        </Popconfirm>
      </div>
      {error && (
        <Alert type="error" message={error} style={{ marginTop: 10 }} />
      )}
    </section>
  );
}
