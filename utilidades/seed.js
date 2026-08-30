import { addItem, getAllItems, getItem } from "./storageDb";
import { INGREDIENTS, METHODS, JARS } from "./constants";

const SEED_FLAG = "alch_seed_done_v1";

function ensureUser({ id, username, role }) {
  const users = getAllItems("users");
  const existing = users.find((u) => u.id === id || u.username === username);
  if (existing) return existing;
  return addItem("users", { username, role, createdAt: Date.now() });
}

function userIdByRole(role) {
  const users = getAllItems("users");
  return users.find((u) => u.role === role)?.id || null;
}

export function seedIfNeeded() {
  const already = localStorage.getItem(SEED_FLAG);
  if (already) return;

  const official = ensureUser({ username: "catador_oficial", role: "OFFICIAL" });
  ensureUser({ username: "alquimista_ana", role: "MEMBER" });
  ensureUser({ username: "alquimista_beto", role: "MEMBER" });


  const guild1 = addItem("guilds", {
    name: "Gremio de la Bruma",
    description: "Estudio de infusiones y destilación antigua.",
    createdAt: Date.now(),
  });

  const guild2 = addItem("guilds", {
    name: "Círculo del Cuarzo",
    description: "Cristalizaciones y conjuro de precisión.",
    createdAt: Date.now(),
  });

  const officialId = userIdByRole("OFFICIAL");

  const formula1 = addItem("formulas", {
    guildId: guild1.id,
    name: "Poción de Penumbra",
    method: METHODS[0], 
    ingredientIds: [INGREDIENTS.DRAGON_SCALE.id, INGREDIENTS.FAIRY_DUST.id],
    jar: JARS.OBSIDIAN.id,
    createdByUserId: official ? official.id : officialId || official?.id,
    createdAt: Date.now() - 1000 * 60 * 30,
    closedAt: null,
  });

  const formula2 = addItem("formulas", {
    guildId: guild2.id,
    name: "Elixir del Umbral",
    method: METHODS[2],
    ingredientIds: [INGREDIENTS.SIREN_LAGRIMA.id, INGREDIENTS.QUARTZ.id],
    jar: JARS.GLASS.id,
    createdByUserId: getAllItems("users").find((u) => u.role === "MEMBER")?.id || officialId,
    createdAt: Date.now() - 1000 * 60 * 20,
    closedAt: null,
  });

  const users = getAllItems("users");
  const ana = users.find((u) => u.username === "alquimista_ana");
  const beto = users.find((u) => u.username === "alquimista_beto");

 
  if (ana && beto) {
    addItem("votes", {
      formulaId: formula1.id,
      method: METHODS[0], 
      category: METHODS[0],
      choice: METHODS[0],
      voterUserId: ana.id,
      createdAt: Date.now() - 1000 * 60 * 15,
    });
    addItem("votes", {
      formulaId: formula1.id,
      method: METHODS[1], 
      category: METHODS[1],
      choice: METHODS[1],
      voterUserId: beto.id,
      createdAt: Date.now() - 1000 * 60 * 10,
    });
  }

  if (officialId) {
    addItem("votes", {
      formulaId: formula1.id,
      method: METHODS[0],
      category: METHODS[0],
      choice: METHODS[0],
      voterUserId: officialId,
      createdAt: Date.now() - 1000 * 60 * 9,
    });
  }

  localStorage.setItem(SEED_FLAG, "1");
}