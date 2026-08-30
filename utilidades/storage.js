const LS_KEYS = {
  users: "alch_users",
  guilds: "alch_guilds",
  formulas: "alch_formulas",
  votes: "alch_votes",
  results: "alch_results",
  rankings: "alch_rankings",
};

function keyFor(type) {
  const k = LS_KEYS[type];
  if (!k) throw new Error(`Unknown type: ${type}`);
  return k;
}

function read(type) {
  const k = keyFor(type);
  const raw = localStorage.getItem(k);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(type, items) {
  const k = keyFor(type);
  localStorage.setItem(k, JSON.stringify(items));
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function getAllItems(type) {
  return read(type);
}

export function getItem(type, id) {
  return read(type).find((x) => x.id === id) || null;
}

export function addItem(type, data) {
  const items = read(type);
  const item = { id: uid(type), ...data };
  items.push(item);
  write(type, items);
  return item;
}

export function updateItem(type, id, patch) {
  const items = read(type);
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error(`No item ${id} in ${type}`);
  items[idx] = { ...items[idx], ...patch };
  write(type, items);
  return items[idx];
}

export function removeItem(type, id) {
  const items = read(type);
  const next = items.filter((x) => x.id !== id);
  write(type, next);
  return true;
}

export function clearAll() {
  Object.values(LS_KEYS).forEach((k) => localStorage.removeItem(k));
}