import type { RelicBehavior, RelicId } from "../../types/build";
import { eachHero, eachStanding } from "../coopHooks";
import { progress } from "../state";
import { aura } from "./aura";
import { bell } from "./bell";
import { daggers } from "./daggers";
import { echo } from "./echo";
import { shards } from "./shards";
import { storm } from "./storm";
import { thorns } from "./thorns";
import { wisp } from "./wisp";

const BEHAVIORS: Readonly<Record<RelicId, RelicBehavior>> = { shards, wisp, daggers, storm, aura, bell, echo, thorns };

/** each relic the hero in play holds, with its memory made on first use */
function eachRelic(
  run: (b: RelicBehavior, memory: Record<string, unknown>, level: number, evolved: boolean) => void,
): void {
  const build = progress.build;
  for (const [id, level] of Object.entries(build.relics) as [RelicId, number][]) {
    const b = BEHAVIORS[id];
    build.memory[id] ??= b.create();
    run(b, build.memory[id], level, build.evolved.includes(id));
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
