import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout.jsx";

export default function Lembur() {
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [tanggal, setTanggal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const res = await api.get("/lembur");
      setList(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data lembur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      await api.post("/lembur", {
        tanggal,
        keterangan,
      });

      setTanggal("");
      setKeterangan("");
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mengajukan lembur"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selesai = async (id) => {
    try {
      await api.post(`/lembur/${id}/finish`);
      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Lembur belum disetujui admin"
      );
    }
  };

  return (
    <MobileLayout title="Lembur">
      {/* ================= AJUKAN ================= */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full mb-4 bg-blue-600 text-white py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        {showForm ? "Tutup Form" : "Ajukan Lembur"}
      </button>

      {/* ================= FORM ================= */}
      {showForm && (
        <form
          onSubmit={submit}
          className="app-card app-card-hover p-4 mb-4 space-y-3"
        >
          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded">
              {error}
            </div>
          )}

          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
            className="w-full border border-slate-200 rounded-lg p-2 bg-white/80"
          />

          <textarea
            placeholder="Keterangan lembur (opsional)"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="w-full border border-slate-200 rounded-lg p-2 bg-white/80"
          />

          <button
            disabled={submitting}
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Mengirim..." : "Kirim Pengajuan"}
          </button>
        </form>
      )}

      {/* ================= LIST ================= */}
      {loading ? (
        <p className="text-center text-gray-500 mt-10">
          Loading...
        </p>
      ) : list.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-lg font-semibold">Belum ada lembur</p>
          <p className="text-sm mt-1">
            Gunakan tombol "Ajukan Lembur"
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="app-card app-card-hover p-3"
            >
              <p className="font-semibold">{item.tanggal}</p>

              <p className="text-sm text-gray-600">
                Mulai: {item.jam_mulai}
                {item.jam_selesai &&
                  ` - Selesai: ${item.jam_selesai}`}
              </p>

              <p className="text-xs text-gray-500">
                {item.keterangan || "-"}
              </p>

              {/* STATUS */}
              <span
                className={`app-chip mt-2 ${
                  item.status === "finished"
                    ? "bg-emerald-100 text-emerald-700"
                    : item.status === "approved"
                      ? "bg-blue-100 text-blue-700"
                      : item.status === "requested"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                }`}
              >
                {item.status}
              </span>

              {/* ACTION */}
              {item.status === "approved" && (
                <button
                  onClick={() => selesai(item.id)}
                  className="mt-3 w-full bg-rose-600 text-white py-2 rounded-lg font-semibold transition hover:bg-rose-700"
                >
                  Selesai Lembur
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </MobileLayout>
  );
}
