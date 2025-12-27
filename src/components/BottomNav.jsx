import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineUser,
} from "react-icons/hi";

export default function BottomNav() {
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center text-xs transition ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-400"
    }`;

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] bg-white border-t z-20">
      <div className="h-16 flex justify-around items-center">

        {/* ===== DASHBOARD ===== */}
        <NavLink to="/dashboard" className={linkClass}>
          <HiOutlineHome size={22} />
          <span className="text-[11px] mt-0.5">Home</span>
        </NavLink>

        {/* ===== ABSENSI ===== */}
        <NavLink to="/absensi" className={linkClass}>
          <HiOutlineClock size={22} />
          <span className="text-[11px] mt-0.5">Absensi</span>
        </NavLink>

        {/* ===== JADWAL ===== */}
        <NavLink to="/jadwal" className={linkClass}>
          <HiOutlineCalendar size={22} />
          <span className="text-[11px] mt-0.5">Jadwal</span>
        </NavLink>

        {/* ===== GAJI ===== */}
        <NavLink to="/gaji" className={linkClass}>
          <HiOutlineCash size={22} />
          <span className="text-[11px] mt-0.5">Gaji</span>
        </NavLink>

        {/* ===== PROFILE ===== */}
        <NavLink to="/profile" className={linkClass}>
          <HiOutlineUser size={22} />
          <span className="text-[11px] mt-0.5">Profil</span>
        </NavLink>

      </div>
    </nav>
  );
}
