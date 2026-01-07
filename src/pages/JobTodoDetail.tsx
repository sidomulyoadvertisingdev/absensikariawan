import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

export default function JobTodoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    api.get(`/job-todos/${id}`).then((res) => setJob(res.data));
  }, [id]);

  const selesai = async () => {
    await api.post(`/job-todos/${id}/done`);
    navigate("/job-todo");
  };

  if (!job) return <MobileLayout title="Job Todo" />;

  return (
    <MobileLayout title="Detail Job">
      <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="font-bold text-lg mb-2">
          {job.title}
        </h2>

        <div
          className="text-sm mb-4"
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
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold"
          >
            Tandai Selesai
          </button>
        )}
      </div>
    </MobileLayout>
  );
}
