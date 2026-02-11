import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

interface JobTodo {
  id: number;
  title: string;
  description: string;
  bonus: number;
  status: string;
}

export default function JobTodoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<JobTodo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/job-todos/${id}`)
      .then((res) => setJob(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const selesai = async () => {
    if (!id) return;

    await api.post(`/job-todos/${id}/done`);
    navigate("/job-todo");
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <MobileLayout title="Job Todo">
        <div className="p-4 text-center text-gray-500">
          Memuat detail job...
        </div>
      </MobileLayout>
    );
  }

  /* ================= JOB TIDAK ADA ================= */
  if (!job) {
    return (
      <MobileLayout title="Job Todo">
        <div className="p-4 text-center text-gray-500">
          Job tidak ditemukan
        </div>
      </MobileLayout>
    );
  }

  /* ================= DETAIL JOB ================= */
  return (
    <MobileLayout title="Detail Job">
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="font-bold text-lg mb-2">{job.title}</h2>

        <div
          className="text-sm mb-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />

        <p className="text-sm mb-4">
          Bonus:{" "}
          <strong>
            Rp {Number(job.bonus).toLocaleString("id-ID")}
          </strong>
        </p>

        {job.status !== "done" && (
          <button
            onClick={selesai}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
          >
            Tandai Selesai
          </button>
        )}
      </div>
    </MobileLayout>
  );
}
