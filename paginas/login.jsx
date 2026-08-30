import { useState } from "react";
import { useApp } from "../states/AppProvider";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import FormField from "../components/FormField";

export default function LoginPage() {
  const { actions } = useApp();
  const nav = useNavigate();

  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("alquimista_ana");
  const [password, setPassword] = useState("1234");
  const [error, setError] = useState(null);

  const submit = () => {
    setError(null);
    try {
      if (mode === "login") {
        actions.login({ username, password });
        nav("/");
      } else {
        actions.register({ username, password });
        setMode("login");
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <div className="text-xl font-bold mb-2">⚗️ Acceso</div>
        <div className="text-sm text-slate-600 mb-4">
          Demo: usuario <b>alquimista_ana</b> / <b>1234</b> (y oficial <b>catador_oficial</b> / <b>1234</b>)
        </div>

        <div className="flex gap-2 mb-4">
          <button
            className={`flex-1 px-3 py-2 rounded ${mode === "login" ? "bg-slate-900 text-white" : "bg-slate-100"}`}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 px-3 py-2 rounded ${mode === "register" ? "bg-slate-900 text-white" : "bg-slate-100"}`}
            onClick={() => setMode("register")}
          >
            Registro
          </button>
        </div>

        <div className="space-y-3">
          <FormField label="Username">
            <input
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_nombre"
            />
          </FormField>

          <FormField label="Password">
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="1234"
            />
          </FormField>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <Button className="w-full" onClick={submit}>
            {mode === "login" ? "Entrar" : "Crear cuenta"}
          </Button>
        </div>
      </Card>
    </div>
  );
}