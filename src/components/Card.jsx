export default function Card({ title, children }) {
  return (
    <div className="app-card app-card-hover p-4 mb-4">
      <h2 className="app-section-title mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}
