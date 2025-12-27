import { useNavigate } from "react-router-dom";
import MobileLayout from "../layout/MobileLayout";

export default function Profile() {
  const navigate = useNavigate();

  // Ambil data user dari localStorage
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const initial =
    name && name.length > 0
      ? name.charAt(0).toUpperCase()
      : "?";

  return (
    <MobileLayout title="Profile">
      {/* ================= HEADER ================= */}
      <div className="bg-blue-600 text-white rounded-xl p-4 mb-4 shadow flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-bold">
          {initial}
        </div>

        <div>
          <p className="text-sm opacity-80">
            Login sebagai
          </p>
          <p className="font-semibold text-lg">
            {name || "-"}
          </p>
          <p className="text-xs opacity-80">
            {role || "user"}
          </p>
        </div>
      </div>

      {/* ================= INFO AKUN ================= */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <p className="text-sm font-semibold mb-3 text-gray-700">
          INFORMASI AKUN
        </p>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-500">Nama</p>
            <p className="font-semibold text-gray-800">
              {name || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold text-gray-800">
              {email || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-semibold capitalize text-gray-800">
              {role || "user"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= AKSI ================= */}
      <div className="bg-white rounded-xl shadow p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Logout
        </button>
      </div>
    </MobileLayout>
  );
}
