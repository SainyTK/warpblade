import { ULT_CHARGE } from "../kael";
import type { LegacyNode } from "../legacySkills";

/** Bastion: the brace, the parry, the vault and the weight behind them. Steady all run. */
export const BASTION: readonly LegacyNode[] = [
  {
    id: "s_stance",
    name: "Firm Stance",
    kind: "passive",
    text: "Max HP +10 per rank, and blocks cost 30% less stamina per rank.",
    ranks: 2,
    stats: { hp: 10 },
  },
  {
    id: "s_parry",
    name: "Ember Parry",
    kind: "enhance",
    text: "The parry window is twice as long, and a parried foe catches fire.",
    ranks: 1,
    perk: "emberParry",
  },
  {
    id: "s_counter",
    name: "Counter Thrust",
    kind: "combo",
    text: "After a parry, J is a counter thrust that deals triple damage and knocks the foe down.",
    ranks: 1,
    perk: "counterThrust",
  },
  {
    id: "s_vaultStrike",
    name: "Vault Strike",
    kind: "combo",
    text: "J during a vault drives the glaive down where you land, hitting everything around you.",
    ranks: 1,
    perk: "vaultStrike",
  },
  {
    id: "s_warpath",
    name: "Warpath",
    kind: "movement",
    text: "Double-tap a side to charge. The charge shoulders small foes aside, and J while charging is a running impale.",
    ranks: 1,
    perk: "warpath",
  },
  {
    id: "s_quake",
    name: "Earthshaker",
    kind: "enhance",
    text: "Landing from a vault or a dive sends a shockwave along the floor both ways.",
    ranks: 1,
    perk: "earthshaker",
  },
  {
    id: "s_bulwark",
    name: "Bulwark",
    kind: "passive",
    text: "Max HP +30% and blocks barely push you back, but attack speed -10%.",
    ranks: 1,
    scale: { hp: 0.3, aspd: -0.1 },
    perk: "bulwark",
  },
  {
    id: "s_unbroken",
    name: "Unbroken",
    kind: "passive",
    text: "Below a third of your HP you take 30% less damage and build Heat twice as fast.",
    ranks: 1,
    perk: "unbroken",
  },
  {
    id: "s_ult",
    name: "Phoenix Dive",
    kind: "ultimate",
    text: `Rise out of sight and crash down as a burning phoenix where the most foes stand, flooding the floor with fire. Level 3 crashes twice, level 4 three times. ${ULT_CHARGE}`,
    ranks: 1,
    ultimate: "phoenixDive",
  },
];
