import { ECHO, SHOULDER_Y } from "../../../constants/mirel/string";
import { PAL, SAND } from "../../../constants/palette";
import { glow, place, px } from "../../../engine/frame";
import { blit } from "../../../engine/sprite";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SpriteImage } from "../../../types/sprite";
import { WHITE } from "../../../utils/color";
import { TAU } from "../../../utils/math";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights, particles, rng } from "../../state";
import { ghostCanvas } from "../afterimages";
import { drawHero } from "../drawHero";
import { heroLook } from "../look";
import { mirel } from "./memory";
import { ringCentre } from "./shape";
import { type StaffStrike, strikeShape } from "./strike";

/** one echo a blow leaves: how long after the blow it lands and its share of the blow's power */
interface EchoBeat {
  delay: number;
  share: number;
}

/** seconds the ghost flashes and swings as its echo lands */
const STRIKE_FLASH = 2 / 30;
/** the clock tick ring round the strike point */
const TICK_RING = 4;

/** the echoes a blow leaves: one at half power after half a second, or what Long Echo and Quickened make of it */
function echoBeats(instant: boolean): EchoBeat[] {
  const echo = skillValues("m_echo");
  const quick = skillValues("m_quicken");
  const quickened = mirel.quickLeft > 0;
  if (quickened && quick.overclock) return [{ delay: 0, share: 1 }];
  const sooner = quickened ? (quick.sooner ?? 0) : 0;
  const delay = instant ? 0 : Math.max(0.05, (echo.delay ?? ECHO.delay) - sooner);
  const share = ECHO.power * (1 + (echo.power ?? 0));
  if (echo.choir) return [delay, delay * 2, delay * 3].map((d, i) => ({ delay: d, share: i === 2 ? 1 : share }));
  const beats = [{ delay, share }];
  if (echo.second) beats.push({ delay: 1 - sooner, share: echo.second });
  return beats;
}

/** where the echo's clock ring sits: the middle of the blow's reach */
function strikePoint(s: StaffStrike): [number, number] {
  const shape = s.spec.shape;
  const sy = s.at.y - SHOULDER_Y;
  if (shape.kind === "ring") return ringCentre(shape, s.at);
  if (shape.kind === "jab") return [s.at.x + s.at.face * (shape.near + shape.far) * 0.5, s.at.y - shape.y];
  const a = (shape.a0 + shape.a1) / 2;
  return [s.at.x + Math.cos(a) * shape.radius * 0.7 * s.at.face, sy + Math.sin(a) * shape.radius * 0.7];
}

/** sand motes the ghost breaks into */
function breakIntoSand(x: number, y: number): void {
  for (let i = 0; i < 10; i++)
    particles.spawn(
      PK.MOTE,
      x + rng.range(-5, 5),
      y + rng.range(-22, 0),
      rng.range(-30, 30),
      rng.range(-20, 30),
      rng.range(0.3, 0.6),
      {
        col: rng.chance(0.5) ? SAND.light : PAL.hour[4],
        size: 0.6,
      },
    );
}

/**
 * An echo of a blow: her pale teal ghost stays where she struck, a clock ring closing round the strike point like a hand
 * sweeping, and when it closes the ghost strikes again with the same shape, each foe once.
 */
function createEcho(s: StaffStrike, ghost: SpriteImage, beat: EchoBeat): Effect {
  let t = 0;
  let landed = -1;
  const struck = new Set<Enemy>();
  const [px0, py0] = strikePoint(s);
  return {
    update(dt) {
      t += dt;
      if (landed >= 0) {
        landed += dt;
        return landed < STRIKE_FLASH;
      }
      if (t < beat.delay) return true;
      landed = 0;
      const strike = { ...s, echo: true, scale: s.scale * (beat.share / ECHO.power) };
      strikeShape(
        strike,
        (e) => struck.has(e),
        (e) => struck.add(e),
      );
      lights.add(px0, py0, 26, PAL.hour[4], 0.7, 0.2);
      breakIntoSand(s.at.x, s.at.y);
      return true;
    },
    draw() {},
    drawBack() {
      const flash = landed >= 0;
      const fade = flash ? 1 - landed / STRIKE_FLASH : 1;
      const swing = flash ? s.at.face * 2 * (landed / STRIKE_FLASH) : 0;
      blit(ghost, s.at.x + swing, s.at.y, s.at.face < 0, {
        alpha: flash ? 0.85 : 0.5,
        tint: flash ? WHITE : PAL.hour[3],
        tintAmount: flash ? 0.6 : 0.7,
        soft: true,
      });
      place();
      glow(s.at.x, s.at.y - 16, 12, PAL.hour[3], 0.12 * fade);
      if (flash) return;
      // a one-pixel ring round the strike point closes as the half second runs out, like a clock hand sweeping
      const left = beat.delay > 0 ? 1 - t / beat.delay : 0;
      const steps = 24;
      for (let i = 0; i < steps * left; i++) {
        const a = -Math.PI / 2 + (i / steps) * TAU;
        px(px0 + Math.cos(a) * TICK_RING, py0 + Math.sin(a) * TICK_RING, PAL.hour[4], 0.85);
      }
      px(px0, py0, PAL.hour[5], 0.9);
    },
  };
}

/** the blow struck now leaves its echoes, with a ghost of her pose as she struck; Long Echo widens their shape and
 *  Still Point lands the first at once */
export function leaveEchoes(s: StaffStrike, instant = false): void {
  drawHero(ghostCanvas, hero.pose, heroLook(2));
  const ghost = ghostCanvas.snapshot();
  const grow = s.grow + withCharms("area", skillValues("m_echo").reach ?? 0);
  for (const beat of echoBeats(instant)) game.fx.push(createEcho({ ...s, grow }, ghost, beat));
}
