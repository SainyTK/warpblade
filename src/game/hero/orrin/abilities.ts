import { ANCHOR_PIN, WHIRLWALL } from "../../../constants/orrin/abilities";
import type { AbilitySlot } from "../../../types/moveset";
import type { OrrinAbility } from "../../../types/orrin";
import { skillEvolved, skillLevel, skillValues, withCharms } from "../../skills/query";
import { hero } from "../../state";
import { castPin } from "./anchorPin";
import { orrin } from "./memory";
import { castAnchorFall } from "./spells/anchorFall";
import { castFence } from "./spells/chainFence";
import { castTether } from "./spells/tether";
import { castWhirl } from "./whirlwall";

/** what one of his abilities needs to sit on the shared bar */
interface Ability {
  label: string;
  /** seconds it still waits, and the length of its recharge */
  wait(): number;
  cooldown(): number;
  /** MP its plain form costs */
  mp(): number;
  cast(wide: boolean): boolean;
}

/** a spell skill's cooldown, as the charms shorten it */
const spellCooldown = (id: string): number => withCharms("cooldown", skillValues(id).cooldown ?? 1);

const ABILITY: Readonly<Record<OrrinAbility, Ability>> = {
  whirlwall: {
    label: "WHIRL",
    wait: () => orrin.whirlCd,
    cooldown: () => WHIRLWALL.cooldown,
    mp: () => WHIRLWALL.mp,
    cast: castWhirl,
  },
  anchorPin: {
    label: "PIN",
    wait: () => orrin.pinCd,
    cooldown: () => ANCHOR_PIN.cooldown,
    // with nobody in reach the pin costs half, so half is enough to try it
    mp: () => ANCHOR_PIN.mp / 2,
    cast: castPin,
  },
  o_chainfence: {
    label: "FENCE",
    wait: () => orrin.fenceCd,
    cooldown: () => spellCooldown("o_chainfence"),
    mp: () => skillValues("o_chainfence").mp ?? 0,
    cast: castFence,
  },
  o_tether: {
    label: "TETHER",
    wait: () => orrin.tetherCd,
    cooldown: () => spellCooldown("o_tether"),
    mp: () => skillValues("o_tether").mp ?? 0,
    cast: castTether,
  },
  o_anchorfall: {
    label: "ANCHOR",
    wait: () => orrin.anchorCd,
    cooldown: () => spellCooldown("o_anchorfall"),
    mp: () => skillValues("o_anchorfall").mp ?? 0,
    cast: castAnchorFall,
  },
};

/** his abilities on I in the order O turns through them: Whirlwall and Anchor Pin from the start, then his spell skills */
const ORDER: readonly OrrinAbility[] = ["whirlwall", "anchorPin", "o_chainfence", "o_tether", "o_anchorfall"];

/** his own two always; a spell skill once held */
const known = (id: OrrinAbility): boolean => id === "whirlwall" || id === "anchorPin" || skillLevel(id) > 0;

/** Orrin's abilities on the shared bar, each with its own recharge */
export const ORRIN_SLOTS: readonly AbilitySlot[] = ORDER.map((id) => {
  const a = ABILITY[id];
  return {
    id,
    label: a.label,
    known: () => known(id),
    wait: a.wait,
    full: () => Math.max(0.01, a.cooldown()),
    affordable: () => hero.mp >= a.mp(),
    cast: a.cast,
    evolved: () => id.startsWith("o_") && skillEvolved(id),
  };
});
