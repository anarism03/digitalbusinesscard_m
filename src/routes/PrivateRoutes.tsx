import type { ReactNode } from "react";
import { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import CompanyAdminLayout from "../components/layout/CompanyAdminLayout";
import SuperAdminLayout from "../components/layout/SuperAdminLayout";
import PageLoader from "../components/shared/PageLoader";
import ErrorState from "../components/shared/ErrorState";
import { fetchAccountInfo } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { routesByRole } from "./routes";

const lazyEl = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export default function PrivateRoutes() {
  const { user, token } = useAppSelector((s) => s.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [accountCheck, setAccountCheck] = useState<{
    token: string | null;
    status: "loading" | "success" | "error";
  }>({ token: null, status: "loading" });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setAccountCheck({ token, status: "loading" });
    dispatch(fetchAccountInfo())
      .unwrap()
      .then((result) => {
        if (!cancelled)
          setAccountCheck({ token, status: result ? "success" : "error" });
      })
      .catch(() => {
        if (!cancelled) setAccountCheck({ token, status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch, token, retry]);

  if (!user) return null;
  if (accountCheck.token !== token || accountCheck.status === "loading")
    return <PageLoader />;
  if (accountCheck.status === "error")
    return <ErrorState onRetry={() => setRetry((value) => value + 1)} />;

  const routes = routesByRole[user.role] ?? [];
  const home = routes[0]?.path ?? "/";
  const Layout =
    user.role === "COMPANY_ADMIN" || user.role === "EMPLOYEE"
      ? CompanyAdminLayout
      : SuperAdminLayout;
  const needsPasswordChange =
    user.isFirstLogin === true ||
    (typeof user.daysUntilPasswordExpiry === "number" &&
      user.daysUntilPasswordExpiry <= 0);
  const isLocked =
    user.role !== "SUPER_ADMIN" &&
    needsPasswordChange &&
    location.pathname !== home;

  if (isLocked) {
    return <Navigate to={home} replace />;
  }

  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<Layout>{lazyEl(element)}</Layout>}
        />
      ))}
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}
