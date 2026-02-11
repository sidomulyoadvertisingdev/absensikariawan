import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, BellDot } from "lucide-react";
import echo from "../lib/echo";
import { useAuth } from "../auth/AuthProvider";

export default function Header({ title }) {
  const { user } = useAuth(); // AMBIL DARI CONTEXT
  const [jobBadge, setJobBadge] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      console.warn("User belum siap, notif job belum aktif");
      return;
    }

    /**
     * =================================================
     * CHANNEL PER USER
     * =================================================
     * - DIRECT JOB -> hanya user ini
     * - BROADCAST -> juga dikirim ke semua karyawan
     */
    const channelName = `job-todo.${user.id}`;

    console.log("Subscribe ke channel:", channelName);

    const channel = echo
      .private(channelName)
      .listen(".job.todo.created", (e) => {
        console.log("JOB TODO BARU", e);

        // badge
        setJobBadge((prev) => prev + 1);

        // toast popup
        toast.success("Job Todo Baru", {
          description: e.title,
          duration: 5000,
        });

        // optional sound
        // new Audio("/notify.mp3").play();
      });

    return () => {
      console.log("Leave channel:", channelName);
      echo.leave(channelName);
    };
  }, [user?.id]);

  return (
    <header className="fixed top-0 w-full max-w-[430px] bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm z-10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent" />
      <div className="h-14 flex items-center justify-between px-4">
        {/* TITLE */}
        <h1 className="text-[17px] font-semibold text-slate-900">
          {title}
        </h1>

        {/* NOTIFICATION ICON */}
        <button
          type="button"
          className="relative grid place-items-center w-9 h-9 rounded-xl bg-slate-100/70 text-slate-700 transition hover:bg-slate-200"
          aria-label="Notifikasi"
        >
          {jobBadge > 0 ? (
            <BellDot className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}

          {jobBadge > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
              {jobBadge}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
