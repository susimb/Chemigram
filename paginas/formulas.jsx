import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../api/db";
import { getCurrentUser } from "../state/auth";
import { INGREDIENTS, METHODS, FLASKS } from "../utils/catalogs";

export default function GuildDetailPage() {
  const { guildId } = useParams();
  const nav = useNavigate();
  const user = getCurrentUser();

  const [guild, setGuild] = useState(null);
  const [formulas, setFormulas] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const state = db.getState();
    const g = state.guilds.find((x) => x.id === guildId);
    setGuild(g || null);
    setFormulas(state.formulas.filter((f) => f.guildId === guildId));
  }, [guildId]);

  const categories = useMemo(() => ({
    ingredients: INGREDIENTS,
    methods: METHODS,
    flasks: FLASKS,
  }), []);

  function refresh() {
    const state = db.getState();
    setGuild(state.guilds.find((x) => x.id === guildId) || null);
    setFormulas(state.formulas.filter((f) => f.guildId === guildId));
  }

  function createFormula(e) {
    e.preventDefault();
    if (!title.trim()) return;

    const state = db.getState();
    const newFormula = {
      id: `f-${Date.now()}`,
      guildId,
      title: title.trim(),
      createdByUserId: user.id,
      createdAt: Date.now(),
      closedAt: null,
    };
    state.formulas.push(newFormula);
    db.setState(state);
    setTitle("");
    refresh();
  }

  if (!user) {
    nav("/auth");
    return null;
  }

  if (!guild) return <div style={{ padding: 16 }}>⚠️ Gremio no encontrado.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>🧪 {guild.name}</h2>

      <form onSubmit={createFormula} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título de la fórmula" />
        <button type="submit">Crear fórmula</button>
      </form>

      <hr />

      <ul>
        {formulas.map((f) => (
          <li key={f.id}>
            <button onClick={() => nav(`/formulas/${f.id}`)}>
              {f.closedAt ? "🔒" : "🗳️"} {f.title}
            </button>
          </li>
        ))}
        {formulas.length === 0 && <li>Aún no hay fórmulas.</li>}
      </ul>
    </div>
  );
}