import { useEffect, useState } from "react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

export default function Gaji() {
  const [gaji, setGaji] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/gaji")
      .then((res) => {
        setGaji(res.data.data);
      })
      .catch(() => {
        setError("Gagal memuat data gaji");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /* ===============================
   * LOADING
   * =============================== */
  if (loading) {
    return (
      <MobileLayout title="Gaji">
        <p className="text-center text-gray-500">Loading...</p>
      </MobileLayout>
    );
  }

  /* ===============================
   * ERROR
   * =============================== */
  if (error) {
    return (
      <MobileLayout title="Gaji">
        <p className="text-center text-red-500">{error}</p>
      </MobileLayout>
    );
  }

  /* ===============================
   * DATA KOSONG
   * =============================== */
  if (!gaji) {
    return (
      <MobileLayout title="Gaji">
        <p className="text-center text-gray-400">
          Data gaji belum tersedia
        </p>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout title="Gaji">
      {/* BULAN */}
      <div className="app-card app-card-hover p-4 mb-4 text-center">
        <p className="text-sm text-gray-500">Periode</p>
        <p className="text-lg font-bold">{gaji.bulan}</p>
      </div>

      {/* DETAIL GAJI */}
      <div className="app-card app-card-hover p-4 space-y-3 mb-4">
        <Row label="Gaji Pokok">
          Rp {Number(gaji.gaji_pokok).toLocaleString("id-ID")}
        </Row>

        <Row label="Uang Makan">
          Rp {Number(gaji.uang_makan).toLocaleString("id-ID")}
        </Row>

        <Row label="Transport">
          Rp {Number(gaji.transport).toLocaleString("id-ID")}
        </Row>

        <Row label="Lembur / Jam">
          Rp {Number(gaji.lembur_per_jam).toLocaleString("id-ID")}
        </Row>
      </div>

      {/* LEMBUR */}
      <div className="app-card app-card-hover p-4 space-y-3 mb-4">
        <Row label="Total Jam Lembur">
          {gaji.total_jam_lembur} jam
        </Row>

        <Row label="Total Lembur">
          Rp {Number(gaji.total_lembur).toLocaleString("id-ID")}
        </Row>
      </div>

      {/* TOTAL GAJI */}
      <div className="bg-gradient-to-br from-emerald-600 to-lime-500 text-white rounded-2xl shadow-lg shadow-emerald-200/60 p-4 flex justify-between items-center">
        <span className="font-semibold text-lg">Total Gaji</span>
        <span className="font-bold text-xl">
          Rp {Number(gaji.total_gaji).toLocaleString("id-ID")}
        </span>
      </div>

      {/* NOTE */}
      <p className="text-xs text-gray-400 text-center mt-4">
        * Data gaji dihitung otomatis berdasarkan jadwal dan lembur
      </p>
    </MobileLayout>
  );
}

/* ===============================
 * COMPONENT BARIS
 * =============================== */
function Row({ label, children }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{children}</span>
    </div>
  );
}
