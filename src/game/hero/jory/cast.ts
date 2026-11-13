import { COMBO } from "../../../constants/combat";
import { KNOCKDOWN } from "../../../constants/jory/mallets";
import { ABILITY_CAST, SPELL_CAST, STEADY_HAND, THUNDER_SKIN } from "../../../constants/jory/moves";
import { sfx } from "../../../services/audio";
import type { JoryAbility } from "../../../types/jory";
import { createSoundWave } from "../../effects/jory/soundWave";
import { emitSkillEvent } from "../../skills/events";
import { withCharms } from "../../skills/query";
import { game, hero, progress } from "../../state";
import { dust, shake } from "../../world";
import { setState, settle } from "../actions";
import { cutForSharedAction, maySharedAct } from "../sharedCut";
import { judge } from "./beat";
import { castBoom } from "./boom";
import { jory } from "./memory";

/** the ability pose: his own abilities have their own, the spell skills share one */
const spell = (id: JoryAbility): boolean => id !== "steadyHand" && id !== "thunderSkin";

/**
 * Cast an ability, judged on the beat, from a free state or a blow's recovery; false while he cannot, which keeps the
 * press waiting. `wide` is Thunder Skin's wide form, already paid for.
 */
export function castAbility(id: JoryAbility, wide: boolean): boolean {
  if (!maySharedAct()) return false;
  cutForSharedAction();
  if (id === "boom") {
    castBoom();
    return true;
  }
  jory.casting = id;
  jory.castWide = wide;
  jory.castOnBeat = judge("I").onBeat;
  if (hero.ground) hero.vx = 0;
  setState(spell(id) ? "spellCast" : "abilityCast");
  sfx.cast();
  return true;
}

/** Steady Hand: for the next beats his window widens and Groove cannot fall */
function steadyHand(): void {
  jory.steadyBeats = STEADY_HAND.beats;
}

/** one wave of Thunder Skin along the floor toward `dir`; on the beat it runs further and knocks down */
function thunderWave(dir: number): void {
  const onBeat = jory.castOnBeat;
  game.fx.push(
    createSoundWave({
      x: hero.x + dir * 8,
      floor: hero.y,
      dir,
      reach: withCharms("area", onBeat ? THUNDER_SKIN.onBeatReach : THUNDER_SKIN.reach),
      speed: THUNDER_SKIN.speed,
      damage: progress.stats.ap * THUNDER_SKIN.ap + progress.stats.ad * THUNDER_SKIN.ad,
      height: 24,
      stagger: COMBO.stagger,
      launch: onBeat ? KNOCKDOWN : undefined,
      source: "abilities",
    }),
  );
}

/** Thunder Skin: the drum beaten against the floor sends a wave ahead, and in its wide form a second one behind */
function thunderSkin(): void {
  thunderWave(hero.face);
  if (jory.castWide) thunderWave(-hero.face);
  dust(hero.x + hero.face * 6, hero.y, 6);
  shake(0.12, jory.castWide ? 3 : 2);
}

/** the cast under way: the ability leaves on its frame, then he settles */
export function runCast(): void {
  const h = hero;
  if (h.ground) h.vx = 0;
  const clip = h.state === "spellCast" ? SPELL_CAST : ABILITY_CAST;
  if (!h.hitDone && h.st >= clip.hit) {
    h.hitDone = true;
    if (jory.casting === "steadyHand") steadyHand();
    if (jory.casting === "thunderSkin") thunderSkin();
    emitSkillEvent({ type: "cast", ability: jory.casting });
  }
  if (h.st >= clip.dur) settle();
}
