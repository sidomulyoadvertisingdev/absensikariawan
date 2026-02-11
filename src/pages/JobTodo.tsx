import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../api/axios";
import MobileLayout from "../layout/MobileLayout";

type Job = {
  id: number;
  title: string;
  status: string;
};

export default function JobTodo() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/job-todos/my")
      .then(
        (res: { data?: { data?: Job[] } }) =>
          setJobs(res.data?.data || [])
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <MobileLayout title="Job Saya">
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-gray-200 rounded-xl" />
        </div>
      ) : (
        <div className="app-card app-card-hover p-4">
          <p className="text-sm font-semibold mb-3">
            JOB YANG SAYA KERJAKAN
          </p>

          {jobs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              Tidak ada job aktif
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
                      Status: {job.status}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/job-todo/${job.id}`)}
                    className="inline-flex items-center gap-1 text-indigo-600 text-sm font-semibold hover:text-indigo-700"
                  >
                    Kerjakan
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </MobileLayout>
  );
}
