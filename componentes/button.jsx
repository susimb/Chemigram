export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border rounded-lg shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}