import { W } from "../../../constants/stage";
import { glow, place } from "../../../engine/frame";
import { fxRng, game, hero, particles } from "../../../game/state";
import { PK } from "../../../types/particle";
import { clamp } from "../../../utils/math";
import { waveScale } from "../../../utils/progression";
import { BLIGHT } from "../colors";
import { circleTouchesHero, drawSporeCloud, type Exposure, exposure, linger, POISON_TONES } from "../spores";
import { CLOUD_SITES } from "./sites";

const CLOUD = { radius: 12, hit: 5, grace: 0.3, notice: 46, speed: 0.35 } as const;

const touches: Exposure[] = CLOUD_SITES.map(() => exposure(CLOUD.grace));
const alert = CLOUD_SITES.map(() => 0);
let clock = 0;

function placeOf(i: number): [number, number] {
  const c = CLOUD_SITES[i];
  const u = clock * CLOUD.speed + c.phase;
  return [c.x + Math.sin(u) * c.span, c.y + Math.sin(u * 2.3 + c.phase) * 5];
}

export function resetClouds(): void {
  clock = 0;
  for (const t of touches) t.inside.clear();
  alert.fill(0);
}

export function updateClouds(dt: number): void {
  clock += dt;
  const scale = waveScale(game.wave).damage;
  CLOUD_SITES.forEach((_, i) => {
    const [x, y] = placeOf(i);
    const near = Math.hypot(hero.x - x, hero.y - 16 - y) < CLOUD.notice;
    alert[i] = clamp(alert[i] + (near ? dt * 3 : -dt * 1.5));
    if (Math.abs(hero.x - x) > W) return;
    linger(touches[i], dt, () => circleTouchesHero(x, y, CLOUD.radius * (0.85 + alert[i] * 0.2)), CLOUD.hit * scale, x);
    if (fxRng.chance(0.15 + alert[i] * 0.3))
      particles.spawn(
        PK.MOTE,
        x + fxRng.range(-CLOUD.radius, CLOUD.radius),
        y + fxRng.range(-6, 6),
        fxRng.range(-4, 4),
        fxRng.range(4, 12),
        fxRng.range(0.5, 1),
        { col: fxRng.pick(BLIGHT.spore), size: 0.5 },
      );
  });
}

export function drawClouds(cameraX: number, t: number): void {
  place();
  CLOUD_SITES.forEach((c, i) => {
    const [x, y] = placeOf(i);
    if (x < cameraX - 30 || x > cameraX + W + 30) return;
    const a = alert[i];
    drawSporeCloud(x, y, CLOUD.radius * (1 + a * 0.2), t + c.phase, 0.85 + a * 0.15, c.phase, POISON_TONES);
    if (a > 0) glow(x, y, 18 + a * 6, BLIGHT.poison[3], 0.25 * a);
  });
}
