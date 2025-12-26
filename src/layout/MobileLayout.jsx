import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function MobileLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Container Mobile */}
      <div className="w-full max-w-[430px] bg-gray-100 relative">
        {/* Header */}
        <Header title={title} />

        {/* Content */}
        <main className="pt-16 pb-20 px-4">
          {children}
        </main>

        {/* Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
}
