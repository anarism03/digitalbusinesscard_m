import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
export default function DemoSession() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  if (!user) return null;
  return (
    <Button
      size="small"
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 1000,
        borderRadius: 20,
        boxShadow: "0 2px 12px #0002",
      }}
      onClick={() => {
        dispatch(logout());
        navigate("/login");
      }}
    >
      Demo · Hesabı dəyiş
    </Button>
  );
}
