import { useEffect, useState } from "react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout.jsx";

export default function JobTodoAvailable() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/job-todos/available")
      .then((res) => setJobs(res.data.data || []));
  }, []);

  const ambilJob = async (id) => {
    await api.post(`/job-todos/${id}/take`);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  return (
    <MobileLayout title="Job Tersedia">
      <div className="app-card app-card-hover p-4">
        <p className="text-sm font-semibold mb-3">
          BROADCAST JOB
        </p>

        {jobs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Tidak ada job tersedia
          </p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-slate-200/70 rounded-xl p-3 flex justify-between items-center bg-white/70 transition hover:bg-white"
              >
                <div>
                  <p className="font-semibold text-sm">
                    {job.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Bonus: Rp {Number(job.bonus).toLocaleString("id-ID")}
                  </p>
                </div>

                <button
                  onClick={() => ambilJob(job.id)}
                  className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition hover:bg-emerald-700"
                >
                  Ambil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
