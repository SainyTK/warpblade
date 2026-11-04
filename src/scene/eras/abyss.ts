import { H, W } from "../../constants/stage";
import { glow, place, px } from "../../engine/frame";
import { hex, mix } from "../../utils/color";
import { Rng } from "../../utils/rng";
import { breakRuins, drawRuinLight, drawVoidFlames, saveSky } from "./abyss/ruins";
import { drawAbyssSky, drawSkyLight, tearPath } from "./abyss/sky";
import type { SceneDef, ScenePalette } from "./sceneDef";

/**
 * Waves 21 to 30: the ruins have fallen into the rift. A black sun burns over a near-black sky, a tear in the sky
 * widens, tower tops float loose and the floor cracks open, darker and more broken wave by wave. The floor lip and
 * slab lips stay light so the floor still reads.
 */

type Pair = readonly [string, string];
const P0_P1: Record<Exclude<keyof ScenePalette, "sky">, Pair> = {
  starDim: ["#1e1428", "#140c1a"],
  starBright: ["#a898b8", "#7a6474"],
  ridgeTop: ["#3e1a34", "#4e1428"],
  ridge: ["#140a16", "#0c060e"],
  towerRim: ["#5a2442", "#6a1c34"],
  towerTop: ["#2c1630", "#26101e"],
  tower: ["#0f0913", "#0a050c"],
  windowLit: ["#ff4a6a", "#ff3a50"],
  windowLow: ["#9a2040", "#8a1830"],
  windowDark: ["#06030a", "#05020a"],
  groundLip: ["#9a7aaa", "#8c6496"],
  groundEdge: ["#4e3462", "#462a52"],
  stone: ["#201628", "#1a1020"],
  stoneTop: ["#2c1e38", "#24162c"],
  mortar: ["#0c0610", "#08040a"],
  moss: ["#3a1a30", "#401424"],
  mossTip: ["#7a2a4a", "#8a2440"],
  vine: ["#2a1222", "#2a0e1a"],
  slabLip: ["#a282b2", "#9268a2"],
  slabEdge: ["#543868", "#4a2c5a"],
  slab: ["#261a32", "#1e1428"],
  slabUnder: ["#0a060e", "#080409"],
  ironLip: ["#5a4a5e", "#4e3e52"],
  iron: ["#241a26", "#1e141e"],
  ironEdge: ["#0a060e", "#080409"],
  mist: ["#6a2a54", "#7a2040"],
};
const SKY0 = ["#0b0611", "#0f0815", "#150a1b", "#1d0c21", "#280e25", "#361228"];
const SKY1 = ["#050308", "#07040a", "#0a050e", "#100612", "#190816", "#260a1a"];

let cached: { k: number; p: ScenePalette } | null = null;
/** the palette at k, kept while k stays the same since the mist asks for it every frame */
function paletteAt(k: number): ScenePalette {
  if (cached?.k === k) return cached.p;
  const out: Partial<Record<keyof ScenePalette, unknown>> = {};
  for (const [key, [a, b]] of Object.entries(P0_P1)) out[key as keyof ScenePalette] = mix(hex(a), hex(b), k);
  out.sky = SKY0.map((a, i) => mix(hex(a), hex(SKY1[i]), k));
  cached = { k, p: out as ScenePalette };
  return cached.p;
}

let tear: [number, number][] = tearPath(0, new Rng(1));
const ASH = [hex("#3a2c3e"), hex("#54445a"), hex("#6e5a6a")];
const EMBER = [hex("#ff9a6a"), hex("#ff5a5a"), hex("#d82a4a")];
const EMBER_GLOW = hex("#e0303a");

export const abyss: SceneDef = {
  palette: paletteAt,
  stars: (k) => Math.round(28 - k * 20),
  windows: 0.14,
  braziers: 0,
  mist: 0.7,
  sky(bg, r, k) {
    tear = tearPath(k, new Rng(21));
    drawAbyssSky(bg, r, k, tear);
    saveSky(bg);
  },
  decorate: (bg, r, k) => breakRuins(bg, r, k, paletteAt(k).towerTop),
  ambient(t, k) {
    drawSkyLight(t, k, tear);
    drawRuinLight(t, k);
    drawVoidFlames(t);
  },
  weather(t, k) {
    // ash and embers drift up toward the tear, a few more each wave
    place();
    const n = 24 + Math.round(k * 22);
    for (let i = 0; i < n; i++) {
      const speed = 7 + ((i * 7) % 11);
      const y = H + 8 - ((t * speed + i * 53) % (H + 16));
      const x = (((i * 67) % W) + Math.sin(t * 0.5 + i * 1.9) * 7 + t * 2) % W;
      if (i % 4 === 0) {
        const c = EMBER[i % 3];
        const b = 0.55 + 0.45 * Math.sin(t * 3 + i);
        px(x, y, c, b);
        glow(x, y, 4, EMBER_GLOW, 0.18 * b);
      } else px(x, y, ASH[i % 3], 0.75);
    }
  },
};
