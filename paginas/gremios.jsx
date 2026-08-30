import { useEffect, useState } from "react";
import { getCurrentUser } from "../state/auth";
import { db } from "../api/db";
import { useNavigate } from "react-router-dom";
import GuildDetail from "./GuildDetailPage";

export default function GuildsPage() {
  const nav = useNavigate();
  const [guilds, setGuilds] = useState([]);

  useEffect(() => {
    const reload = () => {
      const state = db.getState();
      setGuilds(state.guilds);
    };
    reload();
  }, []);

  const user = getCurrentUser();
  if (!user) {
    nav("/auth");
    return null;
  }

  const [name, setName] = useState("");

  function createGuild(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const state = db.getState();
    const newGuild = {
      id: `g-${Date.now()}`,
      name: name.trim(),
      createdByUserId: user.id,
      createdAt: Date.now(),
    };
    state.guilds.push(newGuild);
    db.setState(state);
    setName("");
    setGuilds(state.guilds);
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Gremios</h2>

      <form onSubmit={createGuild} style={{ display: "grid", gap: 8, maxWidth: 360 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del gremio" />
        <button type="submit">Crear gremio</button>
      </form>

      <hr />

      <ul>
        {guilds.map((g) => (
          <li key={g.id}>
            <button onClick={() => nav(`/gremios/${g.id}`)}>🧪 {g.name}</button>
          </li>
        ))}
        {guilds.length === 0 && <li>Sin gremios todavía.</li>}
      </ul>
    </div>
  );
}