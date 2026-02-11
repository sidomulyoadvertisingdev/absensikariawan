import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Coffee,
  Flag,
  LogOut,
} from "lucide-react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout.jsx";
import echo from "../lib/echo";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [absensi, setAbsensi] = useState(null);
  const [jadwalHariIni, setJadwalHariIni] = useState(null);
  const [gaji, setGaji] = useState(null);

  const [jobTodos, setJobTodos] = useState([]);
  const [jobTotal, setJobTotal] = useState(0);

  const hariMap = {
    1: "senin",
    2: "selasa",
    3: "rabu",
    4: "kamis",
    5: "jumat",
    6: "sabtu",
    0: "minggu",
  };

  const formatYMD = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /**
   * ===============================
   * LOAD DASHBOARD DATA
   * ===============================
   */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const today = new Date();
        const hari = hariMap[today.getDay()];

        const [
          absenRes,
          jadwalRes,
          gajiRes,
          jobRes,
        ] = await Promise.all([
          api.get("/absensi/today"),
          api.get("/jadwal"),
          api.get("/gaji"),
          api.get("/job-todos/my"),
        ]);

        setAbsensi(absenRes.data);

        const jadwalPayload = jadwalRes.data;
        const jadwalData = Array.isArray(jadwalPayload)
          ? jadwalPayload
          : jadwalPayload?.data || [];
        const jadwalMode = Array.isArray(jadwalPayload)
          ? "per_hari"
          : jadwalPayload?.mode || "per_hari";

        let jadwalToday = null;
        if (jadwalMode === "per_tanggal") {
          const todayStr = formatYMD(today);
          const found = jadwalData.find(
            (j) => j.tanggal === todayStr
          );

          jadwalToday =
            found && found.aktif === false
              ? {
                  ...found,
                  jam_masuk: null,
                  jam_pulang: null,
                  istirahat_mulai: null,
                  istirahat_selesai: null,
                }
              : found;
        } else {
          jadwalToday = jadwalData.find(
            (j) => j.hari === hari
          );
        }
        setJadwalHariIni(jadwalToday);

        setGaji(gajiRes.data.data);

        setJobTodos(jobRes.data.data || []);
        setJobTotal((jobRes.data.data || []).length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /**
   * ===============================
   * REALTIME JOB TODO (REVERB)
   * ===============================
   */
  useEffect(() => {
    echo
      .private("job-todos")
      .listen(".JobTodoCreated", (e) => {
        console.log("Job Todo Baru:", e);

        setJobTodos((prev) => [
          {
            id: e.id,
            title: e.title,
            status: "pending",
          },
          ...prev,
        ]);

        setJobTotal((prev) => prev + 1);
        alert(`Job Baru!\n${e.title}\nBonus: Rp ${e.bonus}`);
      });

    return () => {
      echo.leave("job-todos");
    };
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
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="h-40 bg-gray-200 rounded-xl" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Dashboard">
      {/* ================= GAJI ================= */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl p-4 mb-4 shadow-lg shadow-blue-200/60">
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

      {/* ================= MENU CEPAT JOB TODO ================= */}
      <div className="app-card app-card-hover p-4 mb-4">
        <p className="text-sm font-semibold mb-3">
          JOB TODO
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/job-todo")}
            className="bg-indigo-600 text-white rounded-2xl p-4 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="text-lg font-bold">{jobTotal}</p>
            <p className="text-sm opacity-80">
              Job Saya
            </p>
          </button>

          <button
            onClick={() => navigate("/job-todo/available")}
            className="bg-emerald-600 text-white rounded-2xl p-4 text-left shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <p className="text-lg font-bold">+</p>
            <p className="text-sm opacity-80">
              Job Tersedia
            </p>
          </button>
        </div>
      </div>

      {/* ================= JOB TODO AKTIF ================= */}
      <div className="app-card app-card-hover p-4 mb-4">
        <p className="text-sm font-semibold mb-3">
          JOB TODO AKTIF
        </p>

        {jobTodos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">
            Tidak ada job aktif
          </p>
        ) : (
          <div className="space-y-3">
            {jobTodos.map((job) => (
              <div
                key={job.id}
                className="border border-slate-200/70 rounded-xl p-3 flex justify-between items-center bg-white/70 transition hover:bg-white"
              >
                <div>
                  <p className="font-semibold text-sm">
                    {job.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: {job.status}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/job-todo/${job.id}`)
                  }
                  className="inline-flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:text-indigo-700"
                >
                  Kerjakan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= TANGGAL ================= */}
      <div className="app-card app-card-hover p-3 mb-4 text-center">
        <p className="text-sm text-gray-600">
          Hari ini
        </p>
        <p className="font-semibold text-gray-800">
          {tanggalHariIni}
        </p>
      </div>

      {/* ================= STATUS ABSENSI ================= */}
      <div className="app-card app-card-hover p-4 mb-4">
        <p className="text-sm font-semibold mb-3">
          STATUS ABSENSI
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              Masuk
            </span>
            <span className="font-semibold">
              {absensi?.jam_masuk || "--:--"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
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
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold transition hover:bg-blue-700"
        >
          Ke Absensi
        </button>
      </div>

      {/* ================= JADWAL ================= */}
      <div className="app-card app-card-hover p-4 mb-6">
        <p className="text-sm font-semibold mb-3">
          JADWAL HARI INI
        </p>

        {jadwalHariIni && jadwalHariIni.jam_masuk ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-slate-500" />
                Masuk
              </span>
              <span>{jadwalHariIni.jam_masuk}</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-slate-600">
                <Coffee className="w-4 h-4 text-slate-500" />
                Istirahat
              </span>
              <span>
                {jadwalHariIni.istirahat_mulai} -{" "}
                {jadwalHariIni.istirahat_selesai}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2 text-slate-600">
                <Flag className="w-4 h-4 text-slate-500" />
                Pulang
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
          className="mt-4 w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold transition hover:bg-slate-200"
        >
          Lihat Jadwal Lengkap
        </button>
      </div>
    </MobileLayout>
  );
}
