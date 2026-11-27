import { FX_BUDGET as B } from "../../constants/skillFx";
import type { Effect } from "../../types/effect";
import { game } from "../state";

const tracked = new Set<Effect>();

const usage = {
  frameAt: -1,
  frameParticles: 0,
  lightEnds: [] as number[],
  lastShake: Number.NEGATIVE_INFINITY,
  lastStop: Number.NEGATIVE_INFINITY,
  lastSound: new Map<string, number>(),
};

const elapsedSince = (at: number): number => (game.t < at ? Number.POSITIVE_INFINITY : game.t - at);

export function liveSkillFx(): number {
  if (tracked.size === 0) return 0;
  const shown = new Set(game.fx);
  for (const effect of tracked) {
    if (!shown.has(effect)) tracked.delete(effect);
  }
  return tracked.size;
}

export function admitScale(quiet: boolean): number | null {
  const live = liveSkillFx();
  if (live >= B.liveHardCap) return quiet ? null : 0.35;
  if (live < B.liveSoftCap) return 1;
  return 1 - (0.65 * (live - B.liveSoftCap)) / (B.liveHardCap - B.liveSoftCap);
}

export function trackSkillFx(effect: Effect): Effect {
  tracked.add(effect);
  return effect;
}

export function particleAllowance(wanted: number): number {
  if (usage.frameAt !== game.t) {
    usage.frameAt = game.t;
    usage.frameParticles = 0;
  }
  const given = Math.max(0, Math.min(wanted, B.particlesPerFrame - usage.frameParticles));
  usage.frameParticles += given;
  return given;
}

export function lightAllowed(life: number): boolean {
  usage.lightEnds = usage.lightEnds.filter((end) => end > game.t && end - game.t < 10);
  if (usage.lightEnds.length >= B.lightsLive) return false;
  usage.lightEnds.push(game.t + life);
  return true;
}

export function shakeReady(): boolean {
  if (elapsedSince(usage.lastShake) < B.feelGap) return false;
  usage.lastShake = game.t;
  return true;
}

export function stopReady(): boolean {
  if (elapsedSince(usage.lastStop) < B.stopGap) return false;
  usage.lastStop = game.t;
  return true;
}

export function soundReady(id: string): boolean {
  if (elapsedSince(usage.lastSound.get(id) ?? Number.NEGATIVE_INFINITY) < B.soundGap) return false;
  usage.lastSound.set(id, game.t);
  return true;
}
