export default function FormField({ label, children }) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-slate-700 mb-1">{label}</div>
      {children}
    </label>
  );
}