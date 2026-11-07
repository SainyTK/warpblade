import { RUST } from "../../../constants/hulda/rust";
import { rustOn } from "../../skills/hulda/rustSpray";
import { skillLevel, skillValues } from "../../skills/query";
import { distance2 } from "../../skills/targets";
import { game, hero } from "../../state";

/** Rust Shards: while a rusted foe stands close, the blows she takes are softened by the skill's share */
export function rustGuard(): number {
  if (!skillLevel("h_rustShards")) return 1;
  const weaken = skillValues("h_rustShards").weaken;
  if (!weaken) return 1;
  const r = RUST.weakenReach;
  const near = game.enemies.some((e) => e.hp > 0 && rustOn(e) > 0 && distance2(e, hero.x, hero.y - 16) <= r * r);
  return near ? 1 - weaken : 1;
}
