import type { SkillBehavior, SkillEvents } from "../types/skillBehavior";
import { usesDrill } from "./selection";

const IDLE: SkillBehavior = { create: () => ({}) };

export function nativeOrDrill(native: SkillBehavior, drill: SkillBehavior = IDLE): SkillBehavior {
  const pick = (): SkillBehavior => (usesDrill() ? drill : native);
  const events = [
    ...new Set([...Object.keys(native.on ?? {}), ...Object.keys(drill.on ?? {})]),
  ] as (keyof SkillEvents)[];
  return {
    create: () => ({ native: native.create(), drill: drill.create() }),
    update: (memory, state, dt) => {
      const m = memory as { native: unknown; drill: unknown };
      const behavior = pick();
      behavior.update?.((behavior === drill ? m.drill : m.native) as never, state, dt);
    },
    draw: (memory, state) => {
      const m = memory as { native: unknown; drill: unknown };
      const behavior = pick();
      behavior.draw?.((behavior === drill ? m.drill : m.native) as never, state);
    },
    drawBack: (memory, state) => {
      const m = memory as { native: unknown; drill: unknown };
      const behavior = pick();
      behavior.drawBack?.((behavior === drill ? m.drill : m.native) as never, state);
    },
    on: Object.fromEntries(
      events.map((type) => [
        type,
        (memory: { native: unknown; drill: unknown }, event: never, state: never) => {
          const behavior = pick();
          const handler = behavior.on?.[type] as ((m: unknown, e: never, s: never) => void) | undefined;
          handler?.(behavior === drill ? memory.drill : memory.native, event, state);
        },
      ]),
    ),
  };
}

export function drillOnly(drill: SkillBehavior): SkillBehavior {
  return nativeOrDrill(IDLE, drill);
}
