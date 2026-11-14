import { feat } from "../../../game/feat";
import { isFree, setState, settle } from "../../../game/hero/actions";
import { endCombo } from "../../../game/hero/combo";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillValues, withCharms } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import { CALDER_STAT } from "../constants/achievements";
import { RELOAD } from "../constants/chamber";
import { fillChamber } from "./chamber";
import { calderSound } from "./sound";
import { calder } from "./state";

/** the quick reload window, wider with Speed Loader */
export function quickWindow(): [number, number] {
  const widen = withCharms("duration", skillValues("ca_speedload").window ?? 0);
  return [RELOAD.quickFrom - widen / 2, RELOAD.quickTo + widen / 2];
}

/** the reload's clock runs faster with Speed Loader and Drum Cylinder */
export const reloadRate = (): number =>
  1 + (skillValues("ca_speedload").rate ?? 0) + (skillValues("ca_drum").reload ?? 0);

/** the cylinder is open and glinting: a J now is a quick reload */
export function quickOpen(): boolean {
  if (hero.state !== "reload" || calder.reloadPressed) return false;
  const [from, to] = quickWindow();
  return hero.st >= from && hero.st <= to;
}

function startReload(): void {
  endCombo(false);
  hero.move = null;
  hero.vx = 0;
  calder.reloadPressed = false;
  calder.reloadQuick = false;
  setState("reload");
  calderSound.open();
  // Spin Cycle: every reload is quick, and the cylinder snaps shut at once
  if (skillValues("ca_speedload").auto) {
    calder.reloadPressed = true;
    calder.reloadQuick = true;
    hero.st = RELOAD.loaded;
  }
}

/**
 * J with an empty chamber on the floor starts the reload. During it the first J decides: in the glint it is a quick
 * reload, the cylinder snaps shut at once with hot rounds; before it the reload is spoiled and runs its length. Past the
 * moment the rounds are in, J ends the reload and goes on to the string.
 */
export function pressReload(): boolean {
  const h = hero;
  if (h.state === "reload") {
    if (h.st >= RELOAD.loaded) {
      settle();
      return false;
    }
    if (calder.reloadPressed) return true;
    calder.reloadQuick = quickOpen();
    calder.reloadPressed = true;
    if (calder.reloadQuick) h.st = RELOAD.loaded;
    return true;
  }
  if (calder.rounds > 0 || !h.ground || !isFree()) return false;
  startReload();
  return true;
}

/** the reload plays: the rounds go in on its `loaded` key, and it ends with its clip */
export function runReload(dt: number): void {
  const h = hero;
  h.st += dt * (reloadRate() - 1);
  if (!h.hitDone && h.st >= RELOAD.loaded) {
    h.hitDone = true;
    fillChamber(calder.reloadQuick);
    calderSound.shut(calder.reloadQuick);
    if (calder.reloadQuick) feat({ kind: "heroCount", stat: CALDER_STAT.quickReloads, add: 1 });
    emitSkillEvent({ type: "calderReload", quick: calder.reloadQuick, ultimate: false });
  }
  if (h.st >= RELOAD.dur) settle();
}
