import { ENEMIES } from "../../constants/enemies";
import { MAX_LEVEL } from "../../constants/growth";
import { W } from "../../constants/stage";
import { FINALE } from "../../constants/waves";
import { sfx } from "../../services/audio";
import { createRift } from "../effects/rift";
import { createFinalGaze } from "../enemies/abyss/finalGaze";
import { kindOf } from "../enemies/kinds";
import { game, showBanner } from "../state";
import { shake } from "../world";
import { stageFoe } from "./foes";
import type { RouteArea } from "./route";
import { trail } from "./trail";

const FINALE_ARRIVAL = 1.6;

export function summonFinale(run: NonNullable<typeof trail>, area: RouteArea): void {
  const rift = kindOf(FINALE.foe).rift;
  const x = area.entrance + W / 2;
  const y = rift.y();
  showBanner(ENEMIES[FINALE.foe].name, FINALE.quiet);
  shake(0.6, 3);
  sfx.boom();
  game.fx.push(
    createRift(x, rift.riftY(y), rift.height, FINALE_ARRIVAL, () => {
      const eye = stageFoe(FINALE.foe, x, y, MAX_LEVEL, 0);
      eye.title = ENEMIES[FINALE.foe].name;
      run.finaleFoe = eye;
      game.enemies.push(eye);
      game.fx.push(createFinalGaze(eye));
      sfx.bossRoar();
    }),
  );
}
