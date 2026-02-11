import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD USER DARI BACKEND ================= */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/me");
        setUser(res.data);
      } catch (err) {
        setError("Gagal memuat data profil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <MobileLayout title="Profile">
        <p className="text-center text-gray-500">Loading...</p>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout title="Profile">
        <div className="bg-red-100 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      </MobileLayout>
    );
  }

  const name = user?.name || "-";
  const email = user?.email || "-";
  const role = user?.role || "user";

  const initial =
    name && name.length > 0
      ? name.charAt(0).toUpperCase()
      : "?";

  return (
    <MobileLayout title="Profile">
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl p-4 mb-4 shadow-lg shadow-blue-200/60 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/90 text-blue-700 flex items-center justify-center text-2xl font-bold shadow">
          {initial}
        </div>

        <div>
          <p className="text-sm opacity-80">Login sebagai</p>
          <p className="font-semibold text-lg">{name}</p>
          <p className="text-xs opacity-80">{role}</p>
        </div>
      </div>

      {/* ================= INFO AKUN ================= */}
      <div className="app-card app-card-hover p-4 mb-4">
        <p className="text-sm font-semibold mb-3 text-gray-700">
          INFORMASI AKUN
        </p>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-500">Nama</p>
            <p className="font-semibold text-gray-800">
              {name}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">
              {email}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-semibold capitalize text-gray-800">
              {role}
            </p>
          </div>
        </div>
      </div>

      {/* ================= AKSI ================= */}
      <div className="app-card app-card-hover p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </div>
    </MobileLayout>
  );
}
