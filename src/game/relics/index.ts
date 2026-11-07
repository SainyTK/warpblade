import type { RelicBehavior, RelicId, RelicMemory } from "../../types/build";
import { eachHero, eachStanding } from "../coopHooks";
import { rememberPerSeat } from "../seatMemory";
import { progress } from "../state";
import { aura } from "./aura";
import { bell } from "./bell";
import { daggers } from "./daggers";
import { echo } from "./echo";
import { shards } from "./shards";
import { storm } from "./storm";
import { thorns } from "./thorns";
import { wisp } from "./wisp";

/** each relic's live state for the hero in play: projectiles, timers, foes in reach. Kept to the host, since it can hold
 *  foes and many projectiles and a guest's HUD never reads it. */
let memory: Partial<Record<RelicId, RelicMemory>> = {};
rememberPerSeat({
  hostOnly: true,
  save: () => memory,
  load(saved) {
    memory = (saved as typeof memory | undefined) ?? {};
  },
});

/** a new run: no relic remembers anything */
export function forgetRelics(): void {
  memory = {};
}

const BEHAVIORS: Readonly<Record<RelicId, RelicBehavior>> = { shards, wisp, daggers, storm, aura, bell, echo, thorns };

/** each relic the hero in play holds, with its memory made on first use */
function eachRelic(
  run: (b: RelicBehavior, memory: Record<string, unknown>, level: number, evolved: boolean) => void,
): void {
  const build = progress.build;
  for (const [id, level] of Object.entries(build.relics) as [RelicId, number][]) {
    const b = BEHAVIORS[id];
    memory[id] ??= b.create();
    run(b, memory[id], level, build.evolved.includes(id));
  }
}

/** every standing hero's relics act */
export function updateRelics(dt: number): void {
  eachStanding(() => eachRelic((b, m, level, evolved) => b.update(m, level, evolved, dt)));
}

export function drawRelicsBack(): void {
  eachHero(() => eachRelic((b, m, level, evolved) => b.drawBack?.(m, level, evolved)));
}

export function drawRelics(): void {
  eachHero(() => eachRelic((b, m, level, evolved) => b.draw?.(m, level, evolved)));
}
