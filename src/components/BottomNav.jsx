import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center text-xs ${
      isActive ? "text-blue-600" : "text-gray-400"
    }`;

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] bg-white border-t">
      <div className="h-16 flex justify-around items-center">
        <NavLink to="/dashboard" className={linkClass}>
          🏠
          <span>Home</span>
        </NavLink>
        <NavLink to="/absensi" className={linkClass}>
          🕒
          <span>Absensi</span>
        </NavLink>
        <NavLink to="/jadwal" className={linkClass}>
          📅
          <span>Jadwal</span>
        </NavLink>
        <NavLink to="/gaji" className={linkClass}>
          💰
          <span>Gaji</span>
        </NavLink>
      </div>
    </nav>
  );
}
