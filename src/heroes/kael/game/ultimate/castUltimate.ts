import { game } from "../../../../game/state";
import { isPrism } from "../prism/job";
import { castCrystalNova, ringBlow } from "./crystalNova";
import { createPrismBeams } from "./nova/beams";

/** Kael's ultimate on U: Crystal Nova, and as the Prism Knight its prism beams after the ring */
export function castKaelUltimate(level: number): void {
  castCrystalNova(level);
  if (isPrism()) game.fx.push(createPrismBeams(level, ringBlow(level)));
}
