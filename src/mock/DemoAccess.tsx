import { useEffect, useId, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Alert, Button, Popconfirm, Select, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { setCredentials } from "../store/authSlice";
import { useAppDispatch } from "../store/hooks";
import { decodeJwt } from "../utils/jwt";
import { getApiErrorMessage } from "../utils/apiError";
import { apiClient } from "../services/axios/axiosInstance";
import { AUTH_STORAGE_KEY } from "../store/authSlice";
import { companyId, DEMO_PASSWORD } from "./seed";
import "./DemoAccess.css";

export default function DemoAccess() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const [pending, setPending] = useState<string>();
  const [error, setError] = useState<string>();
  const [db, setDb] = useState<{
    companies: { id: string; name: string; voen: string; isActive: boolean }[];
    employees: {
      companyId: string;
      email: string;
      role: number;
      isActive: boolean;
    }[];
  }>({ companies: [], employees: [] });
  const [selectedCompany, setSelectedCompany] = useState(companyId(0));
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setError(undefined);
    apiClient
      .get<typeof db>("/demo/accounts")
      .then((data) => {
        if (cancelled) return;
        setDb(data);
        setSelectedCompany((id) =>
          data.companies.some((c) => c.id === id && c.isActive)
            ? id
            : data.companies.find((c) => c.isActive)?.id || "",
        );
      })
      .catch((error) => {
        if (!cancelled) setError(getApiErrorMessage(error));
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen]);
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
    <section aria-label="Demo girişləri" className="demo-access">
      <button
        type="button"
        className="demo-access__toggle"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <strong>Hazır demo hesabları</strong>
        <DownOutlined className="demo-access__arrow" />
      </button>
      <div
        id={contentId}
        className="demo-access__panel"
        data-open={isOpen}
        aria-hidden={!isOpen}
        {...(!isOpen ? { inert: "" } : {})}
      >
        <div className="demo-access__content">
          <div className="demo-access__body">
            <p
              style={{
                margin: "6px 0 12px",
                fontSize: 12,
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Ortaq demo · Vercel Blob
              <br />
              Şəxslər və şirkətlər uydurmadır. Dəyişikliklər bütün cihazlarda
              paylaşılır.
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
                title="Bu cihazdakı giriş təmizlənsin?"
                description="Ortaq məlumatlar və digər cihazlar dəyişməyəcək."
                onConfirm={() => {
                  localStorage.removeItem(AUTH_STORAGE_KEY);
                  window.location.assign("/login");
                }}
                okText="Təmizlə"
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
                  Girişi təmizlə
                </button>
              </Popconfirm>
            </div>
            {error && (
              <Alert type="error" message={error} style={{ marginTop: 10 }} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
