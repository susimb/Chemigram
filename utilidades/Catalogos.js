export const INGREDIENTS = [
  "Escama de dragón",
  "Hoja de mandrágora",
  "Polvo de hada",
  "Lágrima de sirena",
  "Ala de murciélago",
  "Hongo luminoso",
  "Cristal de cuarzo",
].map((label, i) => ({ id: `ing-${i + 1}`, label }));

export const METHODS = [
  "Infusión",
  "Fermentación",
  "Conjuro",
  "Cristalización",
  "Destilación",
].map((label, i) => ({ id: `met-${i + 1}`, label }));

export const FLASKS = [
  "Frasco de vidrio",
  "Frasco de cristal",
  "Frasco de obsidiana",
  "Frasco de cuarzo",
  "Frasco de cobre",
].map((label, i) => ({ id: `fl-${i + 1}`, label }));