import { useState } from "react";
import { login, register, getCurrentUser } from "../state/auth";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); 
  const [error, setError] = useState("");

  const current = getCurrentUser();

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      const user = login({ username, password });
      if (!user) return setError("Credenciales inválidas");
      nav("/gremios");
    } else {
      const res = register({ username, password });
      if (res?.error) return setError(res.error);
      nav("/gremios");
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Inicio de sesión</h2>

      {current && (
        <p>Ya estás logueado como <b>{current.username}</b>. <button onClick={() => nav("/gremios")}>Ir</button></p>
      )}

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setMode("login")} disabled={mode === "login"}>Login</button>{" "}
        <button onClick={() => setMode("register")} disabled={mode === "register"}>Registro</button>
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p style={{ color: "crimson" }}> {error}</p>}

        <button type="submit">
          {mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Oficial: <b>catador-oficial</b> / <b>1234</b>
      </p>
    </div>
  );
}