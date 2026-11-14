import { ACTION_CLIPS } from "../../../constants/clips";
import { createGlint } from "../../../game/effects/flash";
import { feat } from "../../../game/feat";
import { isFree, setState } from "../../../game/hero/actions";
import { comboOpen } from "../../../game/hero/combo";
import { emitSkillEvent } from "../../../game/skills/events";
import { game, hero, lights, progress } from "../../../game/state";
import { sfx } from "../../../services/audio";
import type { AbilitySlot } from "../../../types/moveset";
import { hex } from "../../../utils/color";
import { ABILITY_TINT, LEAST_SWORDS, LOTUS, RECHARGE, STREAM, YUN_ABILITIES } from "../constants/abilities";
import { SWORDS_SENT_STAT } from "../constants/achievements";
import { JADE } from "../look";
import type { YunAbility } from "../types/ability";
import { createLotus } from "./effects/lotus";
import { createStreamSword } from "./effects/stream";
import { hoverPlace } from "./hover";
import { yun } from "./state";
import { spendSwords } from "./swords";

/** the flare at the sword fingers as the swords leave */
const SEND_LIGHT = { radius: 22, strength: 0.4 } as const;

/** where his sword fingers are, in the world */
function fingers(): [number, number] {
  const p = hero.pose;
  return [hero.x + hero.face * p.bx, hero.y + p.by];
}

/** the swords leave his hand: every held sword goes into the ability, which then waits its recharge */
function release(a: YunAbility, wide: boolean): void {
  const places = Array.from({ length: yun.swords }, (_, i) => hoverPlace(i));
  const n = spendSwords();
  const [fx, fy] = fingers();
  lights.add(fx, fy, SEND_LIGHT.radius, JADE[3], SEND_LIGHT.strength, 0.2);
  game.fx.push(createGlint(fx, fy, JADE[4]));
  feat({ kind: "heroCount", stat: SWORDS_SENT_STAT, add: n });
  if (a === "stream") sendStream(places, wide);
  else sendLotus(n, wide);
  emitSkillEvent({ type: "cast", ability: a });
}

function sendStream(places: ReturnType<typeof hoverPlace>[], wide: boolean): void {
  const damage = progress.stats.ap * STREAM.power;
  places.forEach((from, i) => {
    const rise = wide ? STREAM.rises[i % STREAM.rises.length] : 0;
    const reach = wide ? STREAM.wideReach : STREAM.reach;
    game.fx.push(createStreamSword({ from, delay: i * STREAM.gap, reach, rise, damage, source: "abilities" }));
  });
}

function sendLotus(n: number, wide: boolean): void {
  game.fx.push(
    createLotus({
      swords: n,
      radius: wide ? LOTUS.wideRadius : LOTUS.radius,
      life: wide ? LOTUS.wideLife : LOTUS.life,
      damage: progress.stats.ap * LOTUS.power,
      follow: wide,
      source: "abilities",
    }),
  );
}

/** the ability waits its recharge, shortened by haste */
function startWait(a: YunAbility): void {
  yun.wait[a] = RECHARGE[a] / progress.stats.haste;
  yun.waitFull[a] = yun.wait[a];
}

/**
 * I on `a`: with no sword held it waits. Free Hand: in an open string, after a blow has
 * landed, the swords leave at once with no cast pose and the string stays open. Otherwise from a free state he plays
 * the cast and the swords leave on its release frame.
 */
function cast(a: YunAbility, wide: boolean): boolean {
  if (yun.swords < LEAST_SWORDS) return false;
  if (comboOpen(1)) {
    startWait(a);
    sfx.cast();
    release(a, wide);
    return true;
  }
  if (!isFree()) return false;
  startWait(a);
  yun.castAbility = a;
  yun.castWide = wide;
  hero.move = null;
  setState("cast");
  sfx.cast();
  return true;
}

/** while casting: the swords leave on the cast's release frame */
export function runCast(): void {
  const h = hero;
  if (h.hitDone || h.st < ACTION_CLIPS.cast.hit) return;
  h.hitDone = true;
  release(yun.castAbility, yun.castWide);
}

/** the abilities' recharges run down */
export function rechargeAbilities(dt: number): void {
  for (const a of YUN_ABILITIES) yun.wait[a] = Math.max(0, yun.wait[a] - dt);
}

const TAB: Readonly<Record<YunAbility, string>> = { stream: "STREAM", lotus: "LOTUS" };

/** Yun's abilities on I, in the order O turns through them */
export const YUN_SLOTS: readonly AbilitySlot[] = YUN_ABILITIES.map((a) => ({
  id: a,
  label: TAB[a],
  tint: ABILITY_TINT[a],
  known: () => true,
  wait: () => yun.wait[a],
  full: () => Math.max(0.01, yun.waitFull[a]),
  affordable: () => yun.swords >= LEAST_SWORDS,
  cast: (wide: boolean) => cast(a, wide),
  cost: () => "SW",
}));

/** the colour each ability lights the touch buttons in */
export const abilityColor = (a: YunAbility) => hex(ABILITY_TINT[a]);
