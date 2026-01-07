import { useEffect, useState } from "react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

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
      <div className="bg-white rounded-xl p-4 shadow">
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
                className="border rounded-lg p-3 flex justify-between items-center"
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
                  className="bg-emerald-600 text-white px-3 py-1 rounded text-sm"
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
