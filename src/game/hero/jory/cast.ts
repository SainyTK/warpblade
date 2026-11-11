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
import { isFree, setState, settle } from "../actions";
import { deny } from "../deny";
import { abilityMp, abilityWait, startWait } from "./abilities";
import { judge } from "./beat";
import { jory } from "./memory";
import { inRecovery } from "./string";

/** the ability pose: his two abilities have their own, the spell skills share one */
const spell = (id: JoryAbility): boolean => id !== "steadyHand" && id !== "thunderSkin";

/** I: an ability may start from a free state or a blow's recovery, ready and paid for; a refused press is not judged */
export function pressCast(id: JoryAbility): boolean {
  if (!isFree() && !inRecovery()) return false;
  if (abilityWait(id) > 0) {
    deny("cast");
    return true;
  }
  const mp = abilityMp(id);
  if (hero.mp < mp) {
    deny("mp");
    return true;
  }
  hero.mp -= mp;
  startWait(id);
  jory.casting = id;
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

/** Thunder Skin: the drum beaten against the floor sends a wave ahead; on the beat it runs further and knocks down */
function thunderSkin(): void {
  const onBeat = jory.castOnBeat;
  game.fx.push(
    createSoundWave({
      x: hero.x + hero.face * 8,
      floor: hero.y,
      dir: hero.face,
      reach: withCharms("area", onBeat ? THUNDER_SKIN.onBeatReach : THUNDER_SKIN.reach),
      speed: THUNDER_SKIN.speed,
      damage: progress.stats.ap * THUNDER_SKIN.ap + progress.stats.ad * THUNDER_SKIN.ad,
      height: 24,
      stagger: COMBO.stagger,
      launch: onBeat ? KNOCKDOWN : undefined,
      source: "abilities",
    }),
  );
  dust(hero.x + hero.face * 6, hero.y, 6);
  shake(0.12, 2);
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
