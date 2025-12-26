export default function Header({ title }) {
  return (
    <header className="fixed top-0 w-full max-w-[430px] bg-white shadow z-10">
      <div className="h-14 flex items-center px-4">
        <h1 className="text-lg font-semibold text-gray-800">
          {title}
        </h1>
      </div>
    </header>
  );
}
