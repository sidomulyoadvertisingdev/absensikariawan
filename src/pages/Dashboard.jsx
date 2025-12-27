import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [absensi, setAbsensi] = useState(null);
  const [jadwalHariIni, setJadwalHariIni] = useState(null);
  const [gaji, setGaji] = useState(null);

  const hariMap = {
    1: "senin",
    2: "selasa",
    3: "rabu",
    4: "kamis",
    5: "jumat",
    6: "sabtu",
    0: "minggu",
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const today = new Date();
        const hari = hariMap[today.getDay()];

        const [absenRes, jadwalRes, gajiRes] = await Promise.all([
          api.get("/absensi/today"),
          api.get("/jadwal"),
          api.get("/gaji"),
        ]);

        setAbsensi(absenRes.data);

        const jadwalToday = jadwalRes.data.data.find(
          (j) => j.hari === hari
        );
        setJadwalHariIni(jadwalToday);

        setGaji(gajiRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const tanggalHariIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <MobileLayout title="Dashboard">
        <div className="space-y-4 animate-pulse">
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-14 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Dashboard">
      {/* ================= GAJI ================= */}
      <div className="bg-blue-600 text-white rounded-xl p-4 mb-4 shadow">
        <p className="text-sm opacity-80">Gaji Bulan Ini</p>

        {gaji ? (
          <>
            <p className="text-xl font-bold mt-1">
              Rp {Number(gaji.total_gaji).toLocaleString("id-ID")}
            </p>
            <p className="text-xs opacity-80">
              Periode {gaji.bulan}
            </p>
          </>
        ) : (
          <p className="text-sm opacity-80">
            Data gaji belum tersedia
          </p>
        )}
      </div>

      {/* ================= TANGGAL ================= */}
      <div className="bg-white rounded-xl p-3 mb-4 shadow text-center">
        <p className="text-sm text-gray-600">
          Hari ini
        </p>
        <p className="font-semibold text-gray-800">
          {tanggalHariIni}
        </p>
      </div>

      {/* ================= STATUS ABSENSI ================= */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow">
        <p className="text-sm font-semibold mb-3">
          STATUS ABSENSI
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                ✓
              </span>
              Masuk
            </span>
            <span className="font-semibold">
              {absensi?.jam_masuk || "--:--"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                →
              </span>
              Pulang
            </span>
            <span className="font-semibold">
              {absensi?.jam_pulang || "--:--"}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/absensi")}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
        >
          Ke Absensi
        </button>
      </div>

      {/* ================= JADWAL ================= */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow">
        <p className="text-sm font-semibold mb-3">
          JADWAL HARI INI
        </p>

        {jadwalHariIni && jadwalHariIni.jam_masuk ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                ⏰ Masuk
              </span>
              <span>{jadwalHariIni.jam_masuk}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                🍽 Istirahat
              </span>
              <span>
                {jadwalHariIni.istirahat_mulai} -{" "}
                {jadwalHariIni.istirahat_selesai}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                🏁 Pulang
              </span>
              <span>{jadwalHariIni.jam_pulang}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Libur / Tidak ada jadwal
          </p>
        )}

        <button
          onClick={() => navigate("/jadwal")}
          className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold"
        >
          Lihat Jadwal Lengkap
        </button>
      </div>
    </MobileLayout>
  );
}
