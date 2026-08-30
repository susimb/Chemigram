import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="font-bold">{title}</div>
          <button className="text-sm" onClick={onClose}>✖</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}