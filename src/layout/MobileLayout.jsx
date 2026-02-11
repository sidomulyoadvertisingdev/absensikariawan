import Header from "../components/Header.jsx";
import BottomNav from "../components/BottomNav.jsx";

export default function MobileLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-blue-50/40 flex justify-center">
      {/* Container Mobile */}
      <div className="w-full max-w-[430px] relative">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(59,130,246,0.18),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_10%_110%,rgba(14,165,233,0.12),transparent_60%)]" />
        {/* Header */}
        <Header title={title} />

        {/* Content */}
        <main className="pt-16 pb-24 px-4">{children}</main>

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
}
