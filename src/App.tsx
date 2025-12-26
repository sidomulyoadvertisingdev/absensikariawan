import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Absensi from "./pages/Absensi";
import Jadwal from "./pages/Jadwal";
import Gaji from "./pages/Gaji";
import Lembur from "./pages/Lembur";

import RequireAuth from "./auth/RequireAuth";

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* ================= ROOT ================= */}
        <Route
          path="/"
          element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
        />

        {/* ================= LOGIN ================= */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/dashboard" replace /> : <Login />
          }
        />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/absensi"
          element={
            <RequireAuth>
              <Absensi />
            </RequireAuth>
          }
        />

        <Route
          path="/jadwal"
          element={
            <RequireAuth>
              <Jadwal />
            </RequireAuth>
          }
        />

        <Route
          path="/gaji"
          element={
            <RequireAuth>
              <Gaji />
            </RequireAuth>
          }
        />

        <Route
          path="/lembur"
          element={
            <RequireAuth>
              <Lembur />
            </RequireAuth>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
