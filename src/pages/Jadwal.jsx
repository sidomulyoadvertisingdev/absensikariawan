import { useEffect, useState } from "react";
import { Clock, Coffee, Flag } from "lucide-react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout.jsx";

export default function Jadwal() {
  const [jadwal, setJadwal] = useState([]);
  const [mode, setMode] = useState("per_hari");
  const [loading, setLoading] = useState(true);

  const parseTanggal = (tanggal) => {
    if (!tanggal) return null;
    const [y, m, d] = tanggal.split("-").map(Number);
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d);
  };

  const formatTanggal = (tanggal) => {
    const date = parseTanggal(tanggal);
    if (!date) return "-";
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const hariList = [
    "senin",
    "selasa",
    "rabu",
    "kamis",
    "jumat",
    "sabtu",
    "minggu",
  ];

  const normalizeJadwal = (data, currentMode) => {
    if (currentMode !== "per_hari") {
      return data;
    }

    const map = new Map(
      (data || []).map((item) => [item.hari, item])
    );

    return hariList.map((hari) => {
      const existing = map.get(hari);
      if (existing) {
        return existing;
      }

      return {
        hari,
        jam_masuk: null,
        jam_pulang: null,
        istirahat_mulai: null,
        istirahat_selesai: null,
      };
    });
  };

  useEffect(() => {
    api
      .get("/jadwal")
      .then((res) => {
        const payload = res.data;
        const data = Array.isArray(payload)
          ? payload
          : payload?.data || [];
        const currentMode = Array.isArray(payload)
          ? "per_hari"
          : payload?.mode || "per_hari";

        setMode(currentMode);
        setJadwal(normalizeJadwal(data, currentMode));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MobileLayout title="Jadwal Kerja">
        <p className="text-center text-gray-500">Loading...</p>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Jadwal Kerja">
      <p className="text-xs text-gray-500 mb-3">
        Mode:{" "}
        {mode === "per_hari"
          ? "Per Hari"
          : mode === "per_tanggal"
            ? "Per Tanggal"
            : mode.replaceAll("_", " ")}
      </p>
      {jadwal.length === 0 ? (
        <p className="text-sm text-gray-400 text-center">
          Belum ada jadwal
        </p>
      ) : (
        <div className="space-y-3">
          {jadwal.map((item, index) => (
            <div
              key={index}
              className="app-card app-card-hover p-4"
            >
              <p className="font-semibold capitalize mb-1">
                {mode === "per_tanggal"
                  ? formatTanggal(item.tanggal)
                  : item.hari}
              </p>

              {item.jam_masuk && item.aktif !== false ? (
                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Masuk: <b>{item.jam_masuk}</b>
                  </p>
                  <p className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-slate-500" />
                    Istirahat:{" "}
                    <b>
                      {item.istirahat_mulai} -{" "}
                      {item.istirahat_selesai}
                    </b>
                  </p>
                  <p className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-slate-500" />
                    Pulang: <b>{item.jam_pulang}</b>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  Libur / Tidak ada jadwal
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </MobileLayout>
  );
}
