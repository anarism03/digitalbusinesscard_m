import type { ReactNode } from "react";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PageLoader from "../components/shared/PageLoader";

const LoginPage = lazy(() => import("../pages/login/LoginPage"));

const lazyEl = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export default function PublicRoutes() {
  const location = useLocation();
  const loginPath = /^\/super-admin(?:\/|$)/.test(location.pathname)
    ? "/login?mode=super-admin"
    : "/login";
  return (
    <Routes>
      <Route path="/login" element={lazyEl(<LoginPage />)} />
      <Route
        path="*"
        element={
          <Navigate
            to={loginPath}
            replace
            state={{
              from: location.pathname + location.search + location.hash,
            }}
          />
        }
      />
    </Routes>
  );
}
