import { useEffect, useState } from "react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

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
        err.response?.data?.message || "Gagal mengajukan lembur"
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
        className="w-full mb-4 bg-blue-600 text-white py-3 rounded-xl font-semibold"
      >
        {showForm ? "Tutup Form" : "➕ Ajukan Lembur"}
      </button>

      {/* ================= FORM ================= */}
      {showForm && (
        <form
          onSubmit={submit}
          className="bg-white p-4 rounded-xl mb-4 space-y-3 shadow"
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
            className="w-full border rounded p-2"
          />

          <textarea
            placeholder="Keterangan lembur (opsional)"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="w-full border rounded p-2"
          />

          <button
            disabled={submitting}
            className="w-full bg-green-600 text-white py-2 rounded font-semibold disabled:opacity-50"
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
            Gunakan tombol “Ajukan Lembur”
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="bg-white p-3 rounded-xl shadow"
            >
              <p className="font-semibold">{item.tanggal}</p>

              <p className="text-sm text-gray-600">
                Mulai: {item.jam_mulai}
                {item.jam_selesai &&
                  ` • Selesai: ${item.jam_selesai}`}
              </p>

              <p className="text-xs text-gray-500">
                {item.keterangan || "-"}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded font-semibold
                  ${
                    item.status === "finished"
                      ? "bg-green-100 text-green-700"
                      : item.status === "approved"
                      ? "bg-blue-100 text-blue-700"
                      : item.status === "requested"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {item.status}
              </span>

              {/* ACTION */}
              {item.status === "approved" && (
                <button
                  onClick={() => selesai(item.id)}
                  className="mt-3 w-full bg-red-600 text-white py-2 rounded font-semibold"
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
