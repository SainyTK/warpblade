import { createSlash } from "../../../game/effects/slash";
import { feat } from "../../../game/feat";
import { setState, settle } from "../../../game/hero/actions";
import { meleeHit } from "../../../game/meleeHit";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillValues, withCharms } from "../../../game/skills/query";
import { game, hero } from "../../../game/state";
import { boxAhead, newSwing } from "../../../game/world";
import { sfx } from "../../../services/audio";
import { RIPOSTE_CLIP } from "../constants/clips/riposte";
import { RIPOSTE } from "../constants/guard";
import { POINTS } from "../constants/points";
import { STRING_FEEL } from "../constants/string";
import { THRUST } from "./moves/slashes";
import { gainPoints } from "./points";
import { cerise } from "./state";

/** the most links a chain may run: six, more with Riposte Chain */
const maxLinks = (): number => skillValues("ce_riposte").links ?? RIPOSTE.links;
/** the beat after a link lands in which J is the next link */
const beat = (): number => withCharms("duration", skillValues("ce_riposte").window ?? RIPOSTE.beat);

/** start one link of the chain: the first after a parry, then one for each J on the beat */
function startLink(): void {
  cerise.links++;
  cerise.ripNext = false;
  cerise.ripSpoiled = false;
  cerise.ripBeat = 0;
  hero.move = null;
  setState("riposte");
  sfx.swing(1.3 + cerise.links * 0.08);
}

/** a parry answers at once with the first riposte */
export function openRiposte(): void {
  cerise.links = 0;
  startLink();
}

/** the link strikes: a sure crit on her line, harder with every link, a Point if it lands */
function strikeLink(): void {
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...THRUST, R: 32, W: 4 }));
  const power = RIPOSTE.power + RIPOSTE.step * (cerise.links - 1);
  const hits = meleeHit([boxAhead(...RIPOSTE.box)], {
    power,
    kx: 20,
    ky: 0,
    stagger: RIPOSTE.stagger,
    sureCrit: true,
    big: cerise.links >= maxLinks() || !!skillValues("ce_riposte").guardBreak,
    feel: STRING_FEEL.rising,
  });
  if (!hits) return;
  gainPoints(POINTS.riposte);
  feat({ kind: "heroCount", stat: "cerise.ripostes", add: 1 });
  feat({ kind: "heroBest", stat: "cerise.chain", value: cerise.links });
  if (!cerise.ripSpoiled) cerise.ripBeat = beat();
  emitSkillEvent({ type: "riposteLink", link: cerise.links, foe: hero.lastHit });
}

/** J during a riposte: before the link lands it spoils the chain; on the beat after it, it queues the next link */
export function pressRiposte(): boolean {
  if (hero.state !== "riposte") return false;
  if (!hero.hitDone) {
    cerise.ripSpoiled = true;
    return true;
  }
  if (cerise.ripBeat <= 0 || cerise.links >= maxLinks()) return false;
  cerise.ripNext = true;
  cerise.ripBeat = 0;
  return true;
}

/** play the link: strike on its frame, start the next link once the strike has held, settle when the clip ends */
export function runRiposte(): void {
  const h = hero;
  if (!h.hitDone && h.st >= RIPOSTE.at) {
    h.hitDone = true;
    strikeLink();
  }
  if (cerise.ripNext && h.st >= RIPOSTE.at + RIPOSTE.cancel) return startLink();
  if (h.st < RIPOSTE_CLIP.dur) return;
  emitSkillEvent({ type: "riposteEnd", links: cerise.links, foe: h.lastHit });
  settle();
}

/** a shared action cuts the chain */
export function endRiposte(): void {
  cerise.ripBeat = 0;
  cerise.ripNext = false;
}
