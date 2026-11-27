import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../..", import.meta.url));
const out = fileURLToPath(new URL("./manifest.json", import.meta.url));
const memory = new Map();
globalThis.location = new URL("http://localhost/");
globalThis.localStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => memory.set(key, String(value)),
  removeItem: (key) => memory.delete(key),
};
globalThis.matchMedia = () => ({ matches: false, addEventListener: () => {} });
const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});
const { CHARACTERS } = await server.ssrLoadModule("/src/heroes/roster.ts");
const { ARTS } = await server.ssrLoadModule("/src/stages/arts.ts");
const { ELEMENT_ORDER, ELEMENTS } = await server.ssrLoadModule("/src/constants/elements.ts");
const { HONING } = await server.ssrLoadModule("/src/constants/honing.ts");
await server.close();

const icons = [];
for (const hero of CHARACTERS) {
  for (const skill of hero.skills) {
    icons.push({ id: skill.id, set: hero.id, element: skill.element, name: skill.name, text: skill.text });
    icons.push({
      id: `${skill.id}_evo`,
      set: hero.id,
      element: skill.element,
      name: skill.evolution.name,
      text: `Evolved form of ${skill.name}. ${skill.evolution.text}`,
    });
  }
}
for (const art of Object.values(ARTS)) {
  icons.push({
    id: `art_${art.id}`,
    set: "arts",
    element: art.element,
    name: art.name,
    text: art.levels[0].cardText,
  });
}
for (const id of ELEMENT_ORDER) {
  icons.push({ id: `el_${id}`, set: "elements", element: id, name: ELEMENTS[id].name, text: "" });
}
for (const [id, honing] of Object.entries(HONING)) {
  icons.push({ id: `honing_${id}`, set: "cards", element: "none", name: honing.name, text: honing.text });
}
icons.push({
  id: "deeper_charge",
  set: "cards",
  element: "none",
  name: "Deeper Charge",
  text: "Charged skills deal more damage and charge faster.",
});
writeFileSync(out, `${JSON.stringify(icons, null, 2)}\n`);
console.log(`${icons.length} icons in ${out}`);
