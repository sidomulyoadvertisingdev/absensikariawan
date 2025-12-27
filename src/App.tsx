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
import Profile from "./pages/Profile";

import RequireAuth from "./auth/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
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

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
