import { usesDrill } from "../../../../drill";
import type { SkillBehavior, SkillEventType, SkillListener } from "../../../../types/skillBehavior";

type Listeners = NonNullable<SkillBehavior["on"]>;

function quietInDrill<K extends SkillEventType>(listener: SkillListener<K>): SkillListener<K> {
  return (memory, event, state) => {
    if (!usesDrill()) {
      listener(memory, event, state);
    }
  };
}

export function nativeOnly(behavior: SkillBehavior): SkillBehavior {
  const on: Listeners = {};
  for (const type of Object.keys(behavior.on ?? {}) as SkillEventType[]) {
    const listener = behavior.on?.[type] as SkillListener<typeof type> | undefined;
    if (listener) {
      Object.assign(on, { [type]: quietInDrill(listener) });
    }
  }
  return {
    create: behavior.create,
    update: (memory, state, dt) => {
      if (!usesDrill()) {
        behavior.update?.(memory, state, dt);
      }
    },
    on,
  };
}
