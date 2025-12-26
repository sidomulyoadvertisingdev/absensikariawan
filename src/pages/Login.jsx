import { useEffect, useState } from "react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

export default function Lembur() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const res = await api.get("/lembur");
    setList(res.data.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const selesai = async (id) => {
    await api.post(`/lembur/${id}/finish`);
    await loadData();
  };

  return (
    <MobileLayout title="Lembur">
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-3">
          {list.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow p-3"
            >
              <p className="font-semibold">{item.tanggal}</p>
              <p className="text-sm">
                {item.jam_mulai} - {item.jam_selesai}
              </p>

              <p className="text-xs text-gray-500">
                {item.keterangan || "-"}
              </p>

              {/* STATUS */}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded
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
                  className="mt-2 w-full bg-green-600 text-white py-2 rounded"
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
