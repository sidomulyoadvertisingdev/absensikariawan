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
        <p className="text-center text-gray-500">Loading...</p>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Dashboard">
      {/* HEADER TANGGAL */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Hari ini</p>
        <p className="text-lg font-bold capitalize">{tanggalHariIni}</p>
      </div>

      {/* STATUS ABSENSI */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <p className="text-sm text-gray-500">Status Absensi</p>
        <p className="text-lg font-bold capitalize">
          {(absensi?.status || "belum_absen").replace("_", " ")}
        </p>

        <div className="text-xs text-gray-400 mt-1">
          {absensi?.jam_masuk && <p>Masuk: {absensi.jam_masuk}</p>}
          {absensi?.jam_pulang && <p>Pulang: {absensi.jam_pulang}</p>}
        </div>

        <button
          onClick={() => navigate("/absensi")}
          className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Ke Absensi
        </button>
      </div>

      {/* JADWAL HARI INI */}
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <p className="text-sm text-gray-500">Jadwal Hari Ini</p>

        {jadwalHariIni && jadwalHariIni.jam_masuk ? (
          <div className="text-sm mt-1">
            <p>⏰ Masuk: <b>{jadwalHariIni.jam_masuk}</b></p>
            <p>🍽 Istirahat: <b>{jadwalHariIni.istirahat_mulai} - {jadwalHariIni.istirahat_selesai}</b></p>
            <p>🏁 Pulang: <b>{jadwalHariIni.jam_pulang}</b></p>
          </div>
        ) : (
          <p className="text-sm text-gray-400 mt-1">
            Libur / Tidak ada jadwal
          </p>
        )}

        <button
          onClick={() => navigate("/jadwal")}
          className="mt-3 w-full bg-gray-200 text-gray-700 py-2 rounded-lg"
        >
          Lihat Jadwal Lengkap
        </button>
      </div>

      {/* RINGKASAN GAJI */}
      <div className="bg-green-600 text-white rounded-xl shadow p-4">
        <p className="text-sm opacity-80">Gaji Bulan Ini</p>

        {gaji ? (
          <>
            <p className="text-xl font-bold">
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

        <button
          onClick={() => navigate("/gaji")}
          className="mt-3 w-full bg-white text-green-600 py-2 rounded-lg font-semibold"
        >
          Detail Gaji
        </button>
      </div>
    </MobileLayout>
  );
}
