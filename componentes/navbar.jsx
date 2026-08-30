import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../states/AppProvider";

export default function Navbar() {
  const { sessionUser, actions } = useApp();
  const nav = useNavigate();

  const onLogout = () => {
    actions.logout();
    nav("/login");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto p-3 flex items-center justify-between">
        <div className="font-bold">
          ⚗️ Alquimia <span className="text-slate-500 font-normal">- Gremios</span>
        </div>

        <nav className="flex gap-3 items-center">
          {sessionUser ? (
            <>
              <Link className="text-sm text-slate-700 hover:underline" to="/">Gremios</Link>
              <Link className="text-sm text-slate-700 hover:underline" to="/formulas">Fórmulas</Link>
              <Link className="text-sm text-slate-700 hover:underline" to="/ranking">Ranking</Link>
              <button className="text-sm bg-slate-900 text-white px-3 py-1 rounded" onClick={onLogout}>
                Salir
              </button>
            </>
          ) : (
            <Link className="text-sm bg-slate-900 text-white px-3 py-1 rounded" to="/login">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}