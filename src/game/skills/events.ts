import type { SkillEventOf, SkillEventType, SkillListener } from "../../types/skillBehavior";
import { eachHeldBehavior } from "./runtime";

/**
 * Tell the skills of the hero in play that something happened. The shared loop emits blows, casts, dashes, warps,
 * jumps, perfect dodges, kills, hurts and ultimates; a kit emits its parry and its own events (declared by augmenting
 * `SkillEvents`) the same way.
 */
export function emitSkillEvent<K extends SkillEventType>(event: SkillEventOf<K>): void {
  eachHeldBehavior((b, memory, state) => {
    const listener = b.on?.[event.type] as SkillListener<K> | undefined;
    listener?.(memory, event, state);
  });
}
