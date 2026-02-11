import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "sonner";

/* ================= AUTH ================= */
import RequireAuth from "./auth/RequireAuth.jsx";

/* ================= PAGES ================= */
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Absensi from "./pages/Absensi.jsx";
import Jadwal from "./pages/Jadwal.jsx";
import Gaji from "./pages/Gaji.jsx";
import Lembur from "./pages/Lembur.jsx";
import Profile from "./pages/Profile.jsx";

/* 🔥 JOB TODO */
import JobTodo from "./pages/JobTodo.tsx";
import JobTodoAvailable from "./pages/JobTodoAvailable.jsx";
import JobTodoDetail from "./pages/JobTodoDetail.tsx";

export default function App() {
  return (
    <BrowserRouter>

      {/* 🔔 GLOBAL TOAST */}
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={4000}
      />

      <Routes>
        {/* ROOT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

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

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        {/* ================= JOB TODO ================= */}

        {/* JOB SAYA
           - Direct job
           - Broadcast yang sudah diambil
        */}
        <Route
          path="/job-todo"
          element={
            <RequireAuth>
              <JobTodo />
            </RequireAuth>
          }
        />

        {/* JOB TERSEDIA
           - Broadcast job
        */}
        <Route
          path="/job-todo/available"
          element={
            <RequireAuth>
              <JobTodoAvailable />
            </RequireAuth>
          }
        />

        {/* DETAIL JOB
           - Auto accept
           - Selesaikan job
        */}
        <Route
          path="/job-todo/:id"
          element={
            <RequireAuth>
              <JobTodoDetail />
            </RequireAuth>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
