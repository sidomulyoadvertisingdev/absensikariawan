import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import echo from "../lib/echo";
import { useAuth } from "../auth/AuthProvider";

export default function Header({ title }) {
  const { user } = useAuth(); // ✅ AMBIL DARI CONTEXT
  const [jobBadge, setJobBadge] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      console.warn("🔕 User belum siap, notif job belum aktif");
      return;
    }

    /**
     * =================================================
     * CHANNEL PER USER
     * =================================================
     * - DIRECT JOB → hanya user ini
     * - BROADCAST → juga dikirim ke semua karyawan
     */
    const channelName = `job-todo.${user.id}`;

    console.log("📡 Subscribe ke channel:", channelName);

    const channel = echo
      .private(channelName)
      .listen(".job.todo.created", (e) => {
        console.log("🔔 JOB TODO BARU", e);

        // ➕ badge
        setJobBadge((prev) => prev + 1);

        // 🔔 toast popup
        toast.success("Job Todo Baru 🚀", {
          description: e.title,
          duration: 5000,
        });

        // 🔊 optional sound
        // new Audio("/notify.mp3").play();
      });

    return () => {
      console.log("📴 Leave channel:", channelName);
      echo.leave(channelName);
    };
  }, [user?.id]);

  return (
    <header className="fixed top-0 w-full max-w-[430px] bg-white shadow z-10">
      <div className="h-14 flex items-center justify-between px-4">

        {/* TITLE */}
        <h1 className="text-lg font-semibold text-gray-800">
          {title}
        </h1>

        {/* 🔔 NOTIFICATION ICON */}
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-gray-700" />

          {jobBadge > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {jobBadge}
            </span>
          )}
        </div>

      </div>
    </header>
  );
}
