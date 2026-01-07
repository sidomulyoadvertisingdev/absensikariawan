import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "sonner";

/* ================= AUTH ================= */
import RequireAuth from "./auth/RequireAuth";

/* ================= PAGES ================= */
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Absensi from "./pages/Absensi";
import Jadwal from "./pages/Jadwal";
import Gaji from "./pages/Gaji";
import Lembur from "./pages/Lembur";
import Profile from "./pages/Profile";

/* 🔥 JOB TODO */
import JobTodo from "./pages/JobTodo";
import JobTodoAvailable from "./pages/JobTodoAvailable";
import JobTodoDetail from "./pages/JobTodoDetail";

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
