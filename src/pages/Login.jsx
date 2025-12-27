import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      /**
       * 🔑 PENTING
       * Backend Laravel VALIDASI PAKAI `email`
       * UI tetap boleh tulis "Username"
       */
      const res = await api.post("/login", {
        email: username,     // ✅ INI KUNCI (bukan username)
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Username atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f2f4f] flex justify-center">
      <div className="w-full max-w-[430px] relative">

        {/* ===== BACKGROUND IMAGE (ATAS SAJA) ===== */}
        <div
          className="h-56 w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/login-bg.jpg')",
          }}
        >
          <div className="w-full h-full bg-black/30" />
        </div>

        {/* ===== FORM CARD ===== */}
        <div className="-mt-20 px-6">
          <div className="bg-[#143d63] rounded-3xl p-6 shadow-xl">

            {/* TITLE */}
            <h1 className="text-white text-2xl font-bold text-center">
              Welcome Back
            </h1>
            <p className="text-center text-gray-300 text-sm mt-1">
              Login to your account
            </p>

            {/* ERROR */}
            {error && (
              <div className="mt-4 bg-red-100 text-red-600 text-sm p-2 rounded">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={submit} className="mt-6 space-y-4">

              {/* USERNAME / EMAIL */}
              <div>
                <label className="text-sm text-gray-300">
                  Username / Email
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg bg-gray-100 px-3 py-2 outline-none"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 w-full rounded-lg bg-gray-100 px-3 py-2 outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {/* REMEMBER */}
              <div className="flex justify-between items-center text-sm text-gray-300">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Remember me
                </label>
                <span className="text-gray-200">
                  Forgot Password
                </span>
              </div>

              {/* BUTTON */}
              <button
                disabled={loading}
                className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* INFO */}
            <p className="text-center text-gray-300 text-sm mt-6">
              Jika belum punya akses login,
              <br />
              silakan hubungi{" "}
              <span className="text-white font-semibold">
                Admin
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
