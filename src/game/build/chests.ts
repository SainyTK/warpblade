import { CHEST_ROWS } from "../../constants/chest";
import { CHEST_PIXEL_COLORS, CHEST_PIXELS } from "../../constants/chestPixels";
import { CHEST_MOTION as M } from "../../constants/growth";
import { COIN_GOLD } from "../../constants/palette";
import { GROUND, W } from "../../constants/stage";
import { glow, place, sparkle } from "../../engine/frame";
import { sfx } from "../../services/audio";
import type { ChestReward } from "../../types/build";
import { PK } from "../../types/particle";
import { buildStats } from "../../utils/build";
import { rollChest } from "../../utils/chests";
import { clamp } from "../../utils/math";
import { skillOf } from "../../utils/skills";
import { eachStanding } from "../coopHooks";
import { stampPixels } from "../effects/fine";
import { queueEvolution } from "../evolve";
import { feat } from "../feat";
import { refreshGrowing } from "../progress";
import { character, game, hero, lights, particles, progress, rng } from "../state";
import { evolveSkill, raiseCharm, raiseSkill } from "./raise";

/** Chests: dropped by elites, mini bosses and the wave 20 boss; touching one opens it for the hero who touched it. */
interface Chest {
  x: number;
  y: number;
  vy: number;
  /** seconds since it dropped */
  t: number;
  bounced: boolean;
  opened: boolean;
}

/** the chests on the field; the field is shared, so a room keeps one list */
let chests: Chest[] = [];
const HALF_W = Math.floor(CHEST_ROWS[0].length / 2);

export function dropChest(x: number, y: number): void {
  chests.push({
    x: clamp(Math.round(x), HALF_W + 4, W - HALF_W - 4),
    y,
    vy: -M.pop,
    t: 0,
    bounced: false,
    opened: false,
  });
}

export function clearChests(): void {
  chests = [];
}

/** give the hero in play what a chest holds */
function grant(rewards: readonly ChestReward[]): void {
  for (const r of rewards) {
    if (r.type === "evolve") {
      evolveSkill(r.id);
      queueEvolution(skillOf(character, r.id)?.evolution.name ?? "");
    } else if (r.type === "skill") raiseSkill(r.id);
    else if (r.type === "charm") raiseCharm(r.id);
  }
  refreshGrowing();
  if (rewards.some((r) => r.type === "heal")) {
    hero.hp = progress.stats.hp;
    hero.mp = progress.stats.mp;
  }
}

/** the hero in play opens a chest: a burst of gold, the rewards are theirs, and the game waits on the chest screen */
function open(c: Chest): void {
  c.opened = true;
  const rewards = rollChest(character, progress.build, game.wave, buildStats(progress.build).luck, rng);
  grant(rewards);
  progress.build.chest = rewards;
  feat({ kind: "chestOpened", upgrades: rewards.filter((r) => r.type === "skill" || r.type === "charm").length });
  lights.add(c.x, c.y - 6, 70, COIN_GOLD[3], 1, 0.5);
  for (let i = 0; i < 16; i++)
    particles.spawn(
      PK.STAR,
      c.x + rng.range(-6, 6),
      c.y - rng.range(2, 9),
      rng.range(-30, 30),
      -rng.range(30, 80),
      rng.range(0.4, 0.8),
      {
        col: rng.pick([COIN_GOLD[3], COIN_GOLD[4]]),
        size: rng.range(1, 2.5),
      },
    );
  sfx.levelUp();
  game.mode = "chest";
}

/** a standing hero whose feet reach the chest */
const touches = (c: Chest): boolean =>
  hero.state !== "dead" && Math.abs(hero.x - c.x) <= M.reach && Math.abs(hero.y - c.y) <= M.reach * 2;

/** chests fall and bounce once onto the floor; the first standing hero to touch a settled one opens it */
export function updateChests(dt: number): void {
  for (const c of chests) {
    c.t += dt;
    if (c.y < GROUND || c.vy < 0) {
      c.vy += M.gravity * dt;
      c.y += c.vy * dt;
      if (c.y >= GROUND) {
        c.y = GROUND;
        c.vy = c.bounced ? 0 : -c.vy * M.bounce;
        c.bounced = true;
      }
    }
    if (c.t < M.settle || c.opened || game.mode !== "play") continue;
    eachStanding(() => {
      if (!c.opened && game.mode === "play" && touches(c)) open(c);
    });
  }
  chests = chests.filter((c) => !c.opened);
}

/** a wooden chest with planks, gold bands, rivets and a lock, a soft gold glow around it and a glint that runs now and then */
export function drawChests(): void {
  place();
  for (const c of chests) {
    const x = Math.round(c.x);
    const top = Math.round(c.y) - CHEST_ROWS.length;
    glow(c.x, c.y - 4, 14, COIN_GOLD[3], 0.35);
    stampPixels(CHEST_PIXELS, x + 0.5, top + CHEST_ROWS.length / 2, CHEST_PIXEL_COLORS);
    const phase = (c.t % M.glint) / M.glint;
    if (phase < 0.18) sparkle(x - HALF_W + 2 + Math.round(phase * 50), top + 3, 2, COIN_GOLD[4], COIN_GOLD[3], 0.8);
  }
}
