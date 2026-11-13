import { CHAIN } from "../../../constants/hulda/spells";
import { sfx } from "../../../services/audio";
import { emitSkillEvent } from "../../skills/events";
import { skillValues } from "../../skills/query";
import { game, hero } from "../../state";
import { setState, settle } from "../actions";
import { castGate } from "./castGate";
import { type ChainSpec, createChainCast } from "./chainCast";
import { hulda } from "./memory";

const ID = "h_ironChain";

/** I with Iron Chain: the gauntlet goes out on its chain, paid with MP; on the floor */
export function pressChain(): boolean {
  const h = hero;
  const v = skillValues(ID);
  if (!castGate()) return false;
  h.mp -= v.mp;
  hulda.chainCd = v.cooldown;
  h.vx = 0;
  setState("chain");
  emitSkillEvent({ type: "cast", ability: ID });
  return true;
}

/** the chains of this level: ahead, ahead and behind, or Hell Chains' fan of four */
function aims(): ChainSpec["aims"] {
  const v = skillValues(ID);
  const [flat, up] = CHAIN.fan;
  if (v.chains >= 4)
    return [
      [hero.face, flat],
      [hero.face, up],
      [-hero.face, flat],
      [-hero.face, up],
    ];
  return v.both
    ? [
        [hero.face, flat],
        [-hero.face, flat],
      ]
    : [[hero.face, flat]];
}

/** the gauntlet flies on its frame; she hauls until every chain is home */
export function runChain(): void {
  const h = hero;
  h.vx = 0;
  if (!h.hitDone && h.st >= CHAIN.throw) {
    h.hitDone = true;
    const v = skillValues(ID);
    game.fx.push(
      createChainCast({
        power: v.power,
        range: v.range,
        count: v.count,
        yank: v.yank,
        collide: v.collide,
        stomp: v.stomp,
        aims: aims(),
      }),
    );
    sfx.swing(0.6);
  }
  if (h.st >= CHAIN.dur && !hulda.chainBusy) settle();
}
