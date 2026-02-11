import { NavLink } from "react-router-dom";
import {
  Home,
  Clock,
  CalendarDays,
  Wallet,
  User2,
} from "lucide-react";

const navItemBase =
  "group flex flex-col items-center gap-1 text-[11px] font-medium transition";

export default function BottomNav() {
  const itemClass = ({ isActive }) =>
    `${navItemBase} ${
      isActive ? "text-slate-900" : "text-slate-500"
    }`;

  const renderIcon = (Icon, isActive) => (
    <span
      className={`grid place-items-center w-10 h-10 rounded-xl transition ${
        isActive
          ? "bg-blue-600 text-white shadow-md shadow-blue-200/60"
          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
      }`}
    >
      <Icon size={20} />
    </span>
  );

  return (
    <nav className="fixed bottom-3 w-full max-w-[430px] px-4 z-20">
      <div className="h-16 bg-white/85 backdrop-blur-xl border border-slate-200/70 rounded-2xl shadow-lg shadow-slate-200/60 flex justify-around items-center">
        {/* ===== DASHBOARD ===== */}
        <NavLink to="/dashboard" className={itemClass}>
          {({ isActive }) => (
            <>
              {renderIcon(Home, isActive)}
              <span>Home</span>
            </>
          )}
        </NavLink>

        {/* ===== ABSENSI ===== */}
        <NavLink to="/absensi" className={itemClass}>
          {({ isActive }) => (
            <>
              {renderIcon(Clock, isActive)}
              <span>Absensi</span>
            </>
          )}
        </NavLink>

        {/* ===== JADWAL ===== */}
        <NavLink to="/jadwal" className={itemClass}>
          {({ isActive }) => (
            <>
              {renderIcon(CalendarDays, isActive)}
              <span>Jadwal</span>
            </>
          )}
        </NavLink>

        {/* ===== GAJI ===== */}
        <NavLink to="/gaji" className={itemClass}>
          {({ isActive }) => (
            <>
              {renderIcon(Wallet, isActive)}
              <span>Gaji</span>
            </>
          )}
        </NavLink>

        {/* ===== PROFILE ===== */}
        <NavLink to="/profile" className={itemClass}>
          {({ isActive }) => (
            <>
              {renderIcon(User2, isActive)}
              <span>Profil</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
