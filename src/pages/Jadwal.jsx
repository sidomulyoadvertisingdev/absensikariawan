import { useEffect, useState } from "react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

export default function Jadwal() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jadwal")
      .then((res) => setJadwal(res.data.data))
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
      <div className="space-y-3">
        {jadwal.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4"
          >
            <p className="font-semibold capitalize mb-1">
              {item.hari}
            </p>

            {item.jam_masuk ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  ⏰ Masuk: <b>{item.jam_masuk}</b>
                </p>
                <p>
                  🍽 Istirahat:{" "}
                  <b>
                    {item.istirahat_mulai} - {item.istirahat_selesai}
                  </b>
                </p>
                <p>
                  🏁 Pulang: <b>{item.jam_pulang}</b>
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
    </MobileLayout>
  );
}
