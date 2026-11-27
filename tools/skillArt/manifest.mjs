import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../..", import.meta.url));
const out = fileURLToPath(new URL("./manifest.json", import.meta.url));
const spritesOut = fileURLToPath(new URL("./sprites.json", import.meta.url));
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
const { ARMORY_ITEMS } = await server.ssrLoadModule("/src/constants/armory.ts");
const { BOONS } = await server.ssrLoadModule("/src/constants/boons.ts");
const { COIN_TURNS, MOTE_PIXELS, SHARD_PIXELS, XP_ORB_PIXELS } = await server.ssrLoadModule("/src/constants/pickupPixels.ts");
const { CHEST_PIXELS } = await server.ssrLoadModule("/src/constants/chestPixels.ts");
const { ARTS } = await server.ssrLoadModule("/src/stages/arts.ts");
const { ELEMENT_ORDER, ELEMENTS } = await server.ssrLoadModule("/src/constants/elements.ts");
const { HONING } = await server.ssrLoadModule("/src/constants/honing.ts");
await server.close();

const icons = [];
for (const hero of CHARACTERS) {
  for (const [source, id] of Object.entries(hero.sourceIcons)) {
    const name = `${hero.name}'s ${source}`;
    icons.push({ id, set: hero.id, element: "none", name, text: `Damage from ${name} on the run result.` });
  }
  for (const job of hero.jobs ?? []) {
    icons.push({ id: job.icon, set: hero.id, element: "none", name: job.name, text: job.blurb });
  }
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
for (const item of ARMORY_ITEMS) {
  icons.push({ id: item.id, set: "armory", element: "none", name: item.name, text: item.levelText });
}
for (const boon of BOONS) {
  icons.push({ id: boon.id, set: "cards", element: "none", name: boon.name, text: boon.text });
}
const size = (rows) => ({ w: rows[0].length, h: rows.length });
const sprites = {
  coin: size(COIN_TURNS[0]),
  coin_turn: size(COIN_TURNS[1]),
  coin_edge: size(COIN_TURNS[2]),
  xp_orb: size(XP_ORB_PIXELS),
  mote: size(MOTE_PIXELS),
  shard_heart: size(SHARD_PIXELS.heart),
  shard_mana: size(SHARD_PIXELS.mana),
  chest: size(CHEST_PIXELS),
};
writeFileSync(spritesOut, `${JSON.stringify(sprites, null, 2)}\n`);
writeFileSync(out, `${JSON.stringify(icons, null, 2)}\n`);
console.log(`${icons.length} icons in ${out}`);
