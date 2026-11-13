import { HERO_COLORS as HC } from "../../../../constants/palette";
import { JAVELIN } from "../../../../constants/ysra/javelin";
import { fleck, glow, glowLine, hairline, line, polygon } from "../../../../engine/frame";
import { PK } from "../../../../types/particle";
import { WHITE } from "../../../../utils/color";
import { particles, rng } from "../../../state";
import { skin } from "../../skin";

/**
 * Ysra's glaive hurled like a javelin, point first at (x, y) along `angle`: the hooked blade of forge-fire with a white-hot
 * edge, the bronze collar, the long wrapped haft and its cap, drawn at image pixel detail. The blade sheds embers as it
 * flies and a heat haze runs back along the haft.
 */
export function drawThrownGlaive(x: number, y: number, angle: number, t: number): void {
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  const L = JAVELIN.length;
  const neck = L - JAVELIN.head;
  // a point d along the glaive from its butt cap and w across it, toward the blade's edge
  const at = (d: number, w: number): [number, number] => [x - c * (L - d) - n * w, y - n * (L - d) + c * w];
  const bulge = (u: number): number => Math.sin(Math.PI * Math.min(1, u * 1.15)) * JAVELIN.belly;
  // the haft: a dark wrapped pole with a lit top line and bronze wraps
  line(...at(0, 0), ...at(neck, 0), HC.hilt);
  hairline(...at(0.5, -0.4), ...at(neck, -0.4), HC.gloveLight, 0.8);
  for (let d = 3; d < neck - 1; d += 3.5) fleck(...at(d, 0), HC.trimDark);
  fleck(...at(0, 0), HC.trimLight);
  fleck(...at(0.6, 0.4), HC.trim);
  // the blade swells on its edge side and sweeps back to a hooked point
  const edge: [number, number][] = [];
  const spine: [number, number][] = [];
  for (let d = 0; d <= JAVELIN.head; d += 1) {
    const u = d / JAVELIN.head;
    edge.push(at(neck + d, u > 0.85 ? bulge(u) * 0.5 : bulge(u) + 0.6));
    spine.push(at(neck + d, -0.5));
  }
  polygon([...spine, ...edge.reverse()], HC.blade);
  hairline(...at(neck + 1, -0.4), ...at(L - 0.5, -0.3), HC.bladeBack);
  hairline(...at(neck + 1.5, 1.6), ...at(L - 1.5, 1.2), (u) => (u > 0.45 ? WHITE : HC.bladeEdge));
  hairline(...at(neck, -1.6), ...at(neck, 1.6), HC.trim);
  fleck(...at(neck, -1.6), HC.trimLight);
  fleck(x, y, WHITE);
  // the forge-fire in the blade lights the air round it, flickering as it flies
  const flicker = 0.4 + Math.abs(Math.sin(t * 31)) * 0.15;
  glowLine(...at(neck, 0), x, y, 7, skin.ramp[3], flicker);
  glow(...at(L - 3, 0.6), 6, skin.ramp[4], 0.3);
  if (rng.chance(0.5)) {
    const [ex, ey] = at(neck + rng.range(0, JAVELIN.head), rng.range(0, 2));
    particles.spawn(PK.EMBER, ex, ey, -c * 30 + rng.range(-12, 12), -n * 30 - rng.range(10, 30), rng.range(0.3, 0.6), {
      col: skin.ramp[rng.int(3, 5)],
      size: 1,
    });
  }
}
