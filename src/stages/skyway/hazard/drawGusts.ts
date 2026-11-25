import { GROUND, W } from "../../../constants/stage";
import { hairline } from "../../../engine/frame";
import { grain } from "../../../utils/grain";
import { SKYWAY_COLORS as S } from "../scene/palette";
import { gustClock, gustDirection, gustPower, gustStrength, gustWarning } from "./gusts";

const STREAKS = 48;
const SPEED = 330;
const SPAN = W + 80;
const CHEVRONS = 4;

function chevron(x: number, y: number, dir: number, a: number): void {
  hairline(x, y - 3, x + dir * 3, y, S.streak[2], a);
  hairline(x + dir * 3, y, x, y + 3, S.streak[2], a);
  hairline(x - dir * 2, y - 3, x + dir, y, S.streak[1], a * 0.6);
  hairline(x + dir, y, x - dir * 2, y + 3, S.streak[1], a * 0.6);
}

export function drawGusts(cameraX: number): void {
  const blow = gustStrength();
  const warn = gustWarning();
  if (blow <= 0 && warn <= 0) return;
  const dir = gustDirection();
  const clock = gustClock();
  const count = blow > 0 ? Math.round(STREAKS * (0.5 + gustPower() * 0.5)) : Math.round(10 * warn);
  const a = blow > 0 ? blow : warn * 0.5;
  for (let i = 0; i < count; i++) {
    const y = 12 + grain(i, 3) * (GROUND - 16);
    const len = (blow > 0 ? 12 : 6) + grain(i, 7) * 20;
    const speed = SPEED * (0.7 + grain(i, 11) * 0.6);
    const travel = (grain(i, 13) * SPAN + clock * speed) % SPAN;
    const x = dir > 0 ? cameraX - 40 + travel : cameraX + W + 40 - travel;
    const bend = Math.sin(clock * 5 + i) * 0.8;
    if (grain(i, 17) > a) continue;
    const head = i % 4 === 0 ? 3 : 2;
    hairline(x, y, x - dir * len, y + bend, (u) => S.streak[u < 0.25 ? head : u < 0.6 ? head - 1 : 0]);
  }
  if (warn > 0) {
    const edge = dir > 0 ? cameraX + 14 : cameraX + W - 14;
    for (let i = 0; i < CHEVRONS; i++) {
      const pulse = (clock * 2 + i / CHEVRONS) % 1;
      chevron(edge + dir * pulse * 18, 40 + i * 26, dir, warn * (1 - pulse) * 0.9);
    }
  }
}
