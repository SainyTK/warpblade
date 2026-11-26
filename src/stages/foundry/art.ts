import { ignite } from "../../game/enemies/burn";
import { game } from "../../game/state";
import { surfaceBelow } from "../../game/world";
import type { ArtDef, ArtLevel } from "../../types/art";
import { createSlagPatch, igniteAround } from "./flare/patch";
import { drawForgeFlareImpact } from "./flare/pillar";

const row = (cardText: string, damageTimesAttack: number, radius: number, range: number): ArtLevel => ({
  cardText,
  damageTimesAttack,
  radius,
  range,
  speed: null,
  delay: 0.1,
  freeze: 0,
});

const LEVELS = [
  row("Molten iron erupts from the floor ahead.", 4.2, 20, 130),
  row("A hotter pillar that hits harder.", 5.3, 23, 140),
  row("A wider pillar and a longer burning patch.", 6.6, 27, 150),
  row("A taller pillar that reaches farther.", 8.2, 31, 165),
  row("Its full heat: a great column of slag.", 11.2, 36, 180),
] as const;

const PATCH = { share: 0.7, life: 1.3, perLevel: 0.3 } as const;
const BURN = { base: 1.6, perLevel: 0.3 } as const;

export const forgeflare: ArtDef = {
  id: "forgeflare",
  name: "Forge Flare",
  element: "blaze",
  color: 0xff8a3c,
  core: 0xfff0b0,
  look: "flame",
  levels: LEVELS,
  status(foe, level) {
    ignite(foe, BURN.base + BURN.perLevel * level);
  },
  burst(x, y, level) {
    const radius = LEVELS[Math.max(0, Math.min(LEVELS.length, level) - 1)].radius;
    const floor = surfaceBelow(x, y - 4);
    igniteAround(x, floor, radius, BURN.base + BURN.perLevel * level);
    game.fx.push(createSlagPatch(x, floor, radius * PATCH.share, PATCH.life + PATCH.perLevel * level));
  },
  drawImpact: drawForgeFlareImpact,
};
