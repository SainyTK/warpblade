import { createFloorRing } from "../../../../../game/effects/floorRing";
import { hostMemory, rememberPerSeat } from "../../../../../game/seatMemory";
import { game, hero, progress } from "../../../../../game/state";
import { ROSE_RAMP } from "../../../look/rose";
import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { atFloor, atHero, ceriseFx } from "../../fx";
import { foesNear, skillStrike } from "./strike";

const ID = "ce_dive";
const dive = { thrusted: false };
rememberPerSeat(hostMemory(dive));

export const SWALLOW_DIVE_DRILL: CeriseDrillSkill = {
  id: ID,
  modify(m, { values }) {
    m.airSlashes += values.airSlashes;
    m.airDashes += values.airDashes ?? 0;
  },
  slashed(strike) {
    if (strike === "air") {
      dive.thrusted = true;
    }
  },
  moment(moment, { values, evolved }) {
    if (moment === "wallKick" && values.kick) {
      for (const foe of foesNear(hero.x, hero.y - 16, 30)) {
        skillStrike(foe, values.kick, ID);
      }
      ceriseFx(ID, "burst", atHero(10), { damage: progress.stats.ad * values.kick, quiet: true });
    }
    if (moment !== "landing") {
      return;
    }
    const thrusted = dive.thrusted;
    dive.thrusted = false;
    if (!thrusted) {
      return;
    }
    const reach = evolved ? values.storm : 34;
    const damage = progress.stats.ad * (1 + values.stomp) * 2;
    ceriseFx(ID, "pillar", atFloor(hero.x, hero.y, 30), { damage, sigil: "needle", lift: 30 });
    if (!values.stomp) {
      return;
    }
    ceriseFx(ID, "nova", atFloor(hero.x, hero.y, reach * 0.6), { damage, quiet: true });
    game.fx.push(createFloorRing(hero.x, hero.y, reach, ROSE_RAMP, 0.35));
    for (const foe of foesNear(hero.x, hero.y - 10, reach)) {
      skillStrike(foe, values.stomp, ID);
      if (values.pin) {
        foe.pinned = Math.max(foe.pinned, values.pin);
      }
      if (evolved) {
        foe.x += Math.sign(hero.x - foe.x) * Math.max(0, Math.min(Math.abs(hero.x - foe.x) - 8, 24));
      }
    }
  },
};
