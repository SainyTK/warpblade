import { drillFighter } from "../../../../../drill";
import { game } from "../../../../../game/state";
import type { YunDrillSkill } from "../../../types/drillSkill";
import { createEchoThrust } from "../../effects/echoThrust";
import { hoverPlace } from "../../hover";

const ID = "yu_echo";
const GAP = 0.04;
const HEIGHTS = [-24, -16, -30, -20] as const;

export const TWIN_ECHO_DRILL: YunDrillSkill = {
  id: ID,
  slashed(strike, landed, { values, evolved }) {
    const echoes = strike === "second" || (values.first && strike === "first") || (values.all && strike !== "warp");
    if (!landed || !echoes || !drillFighter()) {
      return;
    }
    for (let i = 0; i < values.swords; i++) {
      game.fx.push(
        createEchoThrust({
          from: hoverPlace(i),
          delay: i * GAP,
          reach: evolved ? values.myriad : values.reach,
          height: HEIGHTS[i % HEIGHTS.length],
          power: values.power,
          crit: evolved,
          back: values.back ?? 0,
          chill: 0,
        }),
      );
    }
  },
};
