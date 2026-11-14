import { skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { SPOUT } from "../../constants/abilities";
import { QUICKSAND } from "../../constants/spells";
import { createSpout } from "../effects/spout";
import { createPit } from "./quicksand";

/** Meteor Dune: the descent lands and throws a sandspout up each way, and opens a pit of quicksand under him */
export function meteorDune(): void {
  const damage = progress.stats.ap * SPOUT.power;
  for (const dir of [1, -1])
    game.fx.push(createSpout(hero.x + dir * 10, hero.y, dir, { damage, range: 1, source: "za_falling" }));
  const pit = skillValues("za_quicksand");
  if (!pit.life) return;
  game.fx.push(
    createPit(hero.x, hero.y, withCharms("area", QUICKSAND.reach * (pit.reach ?? 1)), withCharms("duration", pit.life)),
  );
}
