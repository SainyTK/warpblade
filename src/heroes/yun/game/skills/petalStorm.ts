import { skillLevel, skillValues } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { SKILL } from "../../constants/skillIds";
import { AIR_LIMIT } from "../../constants/string";
import { createQiWave } from "../effects/qiWave";
import { yun } from "../state";
import { gainSwords } from "../swords";

/** Falling Petal's qi wave: how far it runs, how fast, how tall, and its height from his feet */
const WAVE = { reach: 80, speed: 300, half: 8, height: -10 } as const;

/** air cuts per jump: his own two, more with Petal Storm */
export const airLimit = (): number => AIR_LIMIT + (skillValues(SKILL.petal).air ?? 0);
/** echo thrusts per sword after an air cut */
export const airEchoes = (): number => skillValues(SKILL.petal).airEcho ?? 1;

/** an air cut is out: the first that lands each jump gives a sword, and Falling Petal sends its wave */
export function airCut(id: string, hits: number): void {
  if (!skillLevel(SKILL.petal)) return;
  const v = skillValues(SKILL.petal);
  if (v.sword && hits > 0 && !yun.airSword) {
    yun.airSword = true;
    gainSwords(1);
  }
  if (id !== "fallingPetal" || !v.wave) return;
  game.fx.push(
    createQiWave(hero.x + hero.face * 10, hero.y + WAVE.height, hero.face, {
      reach: WAVE.reach,
      speed: WAVE.speed,
      damage: progress.stats.ad * v.wave,
      half: WAVE.half,
    }),
  );
}

/** he stands on the floor: the next jump's air sword may come again */
export function touchedFloor(): void {
  yun.airSword = false;
}
