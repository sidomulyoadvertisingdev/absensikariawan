import { useEffect, useState } from "react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout.jsx";

export default function Gaji() {
  const [gaji, setGaji] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/gaji")
      .then((res) => setGaji(res.data.data))
      .catch(() => setError("Gagal memuat data gaji"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MobileLayout title="Gaji">
        <p className="text-center text-gray-500">Loading...</p>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout title="Gaji">
        <p className="text-center text-red-500">{error}</p>
      </MobileLayout>
    );
  }

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
      {/* HEADER TOTAL */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl p-4 mb-4 shadow-lg shadow-blue-200/60">
        <p className="text-xs opacity-80">Periode</p>
        <p className="text-lg font-semibold">{gaji.bulan}</p>
        <p className="text-sm mt-2 opacity-80">Total Gaji</p>
        <p className="text-2xl font-bold">
          {formatRupiah(gaji.total_gaji)}
        </p>
      </div>

      {/* RINGKASAN */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard
          label="Gaji Kotor"
          value={formatRupiah(gaji.salary_kotor)}
        />
        <StatCard
          label="Total Potongan"
          value={formatRupiah(gaji.total_potongan)}
        />
        <StatCard
          label="Hadir / Telat"
          value={`${num(gaji.hari_hadir)} / ${num(gaji.hari_telat)}`}
          subtle={`${num(gaji.presensi)} presensi`}
        />
        <StatCard
          label="Off Day"
          value={num(gaji.off_day)}
          subtle={`${num(gaji.menit_terlambat)} menit telat`}
        />
      </div>

      {/* KEHADIRAN */}
      <Section title="Kehadiran">
        <Row label="Total Presensi">{num(gaji.presensi)}</Row>
        <Row label="Hari Hadir">{num(gaji.hari_hadir)}</Row>
        <Row label="Hari Telat">{num(gaji.hari_telat)}</Row>
        <Row label="Hari Tambahan">{num(gaji.hari_tambahan)}</Row>
        <Row label="Off Day">{num(gaji.off_day)}</Row>
        <Row label="Menit Terlambat">
          {num(gaji.menit_terlambat)} menit
        </Row>
      </Section>

      {/* GAJI DASAR */}
      <Section title="Gaji Dasar">
        <Row label="Gaji Pokok">{formatRupiah(gaji.gaji_pokok)}</Row>
        <Row label="Gaji per Hari">
          {formatRupiah(gaji.gaji_per_hari)}
        </Row>
        <Row label="Hari Normal">{num(gaji.hari_normal)}</Row>
        <Row label="Hari Tambahan">{num(gaji.hari_tambahan)}</Row>
        <Row label="Gaji Normal">{formatRupiah(gaji.gaji_normal)}</Row>
        <Row label="Gaji Tambahan">
          {formatRupiah(gaji.gaji_tambahan)}
        </Row>
        <Row label="Gaji Bruto">{formatRupiah(gaji.gaji_bruto)}</Row>
      </Section>

      {/* TUNJANGAN */}
      <Section title="Tunjangan">
        <Row label="Tunjangan Umum">
          {formatRupiah(gaji.tunjangan_umum)}
        </Row>
        <Row label="Transport">
          {formatRupiah(gaji.tunjangan_transport)}
        </Row>
        <Row label="THR">{formatRupiah(gaji.tunjangan_thr)}</Row>
        <Row label="Kesehatan">
          {formatRupiah(gaji.tunjangan_kesehatan)}
        </Row>
        <Row label="Total Tunjangan Master">
          {formatRupiah(gaji.total_tunjangan_master)}
        </Row>
        <Row label="Include Tunjangan">
          {gaji.include_tunjangan ? "Ya" : "Tidak"}
        </Row>
        <Row label="Tunjangan Payroll">
          {formatRupiah(gaji.tunjangan_payroll)}
        </Row>
        <Row label="Total Tunjangan">
          {formatRupiah(gaji.total_tunjangan)}
        </Row>
      </Section>

      {/* LEMBUR & BONUS */}
      <Section title="Lembur & Bonus">
        <Row label="Jam Lembur">{num(gaji.jam_lembur)} jam</Row>
        <Row label="Uang Lembur">
          {formatRupiah(gaji.uang_lembur)}
        </Row>
        <Row label="Bonus Job">{formatRupiah(gaji.bonus_job)}</Row>

        {Array.isArray(gaji.bonus_job_items) &&
          gaji.bonus_job_items.length > 0 && (
            <div className="pt-2 space-y-1 text-xs text-gray-500">
              {gaji.bonus_job_items.map((item) => (
                <div
                  key={item.title}
                  className="flex justify-between border border-slate-100 rounded-lg px-3 py-2 bg-white/60"
                >
                  <span className="font-medium text-slate-700">
                    {item.title}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {formatRupiah(item.bonus)}
                  </span>
                </div>
              ))}
            </div>
          )}
      </Section>

      {/* POTONGAN */}
      <Section title="Potongan">
        <Row label="Potongan Telat">
          {formatRupiah(gaji.potongan_telat)}
        </Row>
        <Row label="Potongan Training">
          {formatRupiah(gaji.potongan_training)}
        </Row>
        <Row label="Potongan Aturan Lain">
          {formatRupiah(gaji.potongan_aturan)}
        </Row>
        <Row label="Total Potongan">
          {formatRupiah(gaji.total_potongan)}
        </Row>
      </Section>

      {/* TOTAL BERSIH */}
      <div className="bg-gradient-to-br from-emerald-600 to-lime-500 text-white rounded-2xl shadow-lg shadow-emerald-200/60 p-4 flex justify-between items-center mt-4">
        <span className="font-semibold text-lg">Gaji Bersih</span>
        <span className="font-bold text-xl">
          {formatRupiah(gaji.total_gaji)}
        </span>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Data gaji mengikuti perhitungan payroll (hadir, lembur, bonus, dan potongan).
      </p>
    </MobileLayout>
  );
}

function StatCard({ label, value, subtle }) {
  return (
    <div className="app-card app-card-hover p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-base font-semibold text-slate-800">
        {value}
      </p>
      {subtle && (
        <p className="text-[11px] text-gray-400 mt-0.5">{subtle}</p>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="app-card app-card-hover p-4 mb-4">
      <p className="text-sm font-semibold mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{children}</span>
    </div>
  );
}

function formatRupiah(val) {
  return `Rp ${Number(val || 0).toLocaleString("id-ID")}`;
}

function num(val) {
  return Number(val || 0).toLocaleString("id-ID");
}
