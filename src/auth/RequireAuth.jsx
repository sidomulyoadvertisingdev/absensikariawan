import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const isAuth = token && token !== "null";

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
