import { App as AntApp } from "antd";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageLoader from "./components/shared/PageLoader";
import PublicRoutes from "./routes/PublicRoutes";
import { logout } from "./store/authSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { bindMessageApi } from "./utils/feedback";
import { decodeJwt, getTokenExpiration } from "./utils/jwt";

import DemoSession from "./mock/DemoSession";

const PrivateRoutes = lazy(() => import("./routes/PrivateRoutes"));
const CardPage = lazy(() => import("./pages/public/CardPage"));

function FeedbackBinder() {
  const { message } = AntApp.useApp();
  bindMessageApi(message);
  return null;
}

export default function App() {
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const hasSession = Boolean(user && token);

  useEffect(() => {
    if (!token) return;
    let timeout: number | undefined;
    const checkToken = () => {
      window.clearTimeout(timeout);
      if (!decodeJwt(token)) {
        dispatch((dispatch, getState) => {
          if (getState().auth.token === token) dispatch(logout());
        });
        return;
      }
      const expiry = getTokenExpiration(token);
      if (expiry !== null) {
        timeout = window.setTimeout(
          checkToken,
          Math.min(Math.max(expiry - Date.now(), 0), 2_147_483_647),
        );
      }
    };
    checkToken();
    window.addEventListener("focus", checkToken);
    document.addEventListener("visibilitychange", checkToken);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("focus", checkToken);
      document.removeEventListener("visibilitychange", checkToken);
    };
  }, [dispatch, token]);

  return (
    <BrowserRouter>
      <FeedbackBinder />
      <DemoSession />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/v/:id" element={<CardPage />} />
          <Route
            path="*"
            element={hasSession ? <PrivateRoutes /> : <PublicRoutes />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
