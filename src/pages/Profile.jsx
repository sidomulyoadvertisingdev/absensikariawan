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

  return (
    <MobileLayout title="Profile">
      {/* INFO USER */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <p className="text-sm text-gray-500 mb-2">Informasi Akun</p>

        <div className="space-y-1 text-sm">
          <p>
            <span className="text-gray-500">Login sebagai</span>
            <br />
            <span className="font-semibold">{name || "-"}</span>
          </p>

          <p>
            <span className="text-gray-500">Email</span>
            <br />
            <span className="font-semibold">{email || "-"}</span>
          </p>

          <p>
            <span className="text-gray-500">Role</span>
            <br />
            <span className="font-semibold capitalize">
              {role || "user"}
            </span>
          </p>
        </div>
      </div>

      {/* AKSI */}
      <div className="bg-white rounded-xl shadow p-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </MobileLayout>
  );
}
