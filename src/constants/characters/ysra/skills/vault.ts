import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * crash: the vault crash's attack damage multiple; reach: pixels it hits to each side; sweeps: air sweeps before she
 * lands; quake: the landing shockwave's power (0 off), over quakeRange pixels each way, stunning quakeStun seconds;
 * airVault: I in the flight vaults again; cooldown: seconds between vaults; launch: the crash throws foes up; ring: the
 * crash's ring of fire, in ability power (0 off); meteor: the evolved crash's radius; burn: seconds the crater burns
 */
const levels = grow(
  {
    crash: 1.9,
    reach: 36,
    sweeps: 1,
    quake: 0,
    quakeRange: 0,
    quakeStun: 0,
    airVault: 0,
    cooldown: 0.95,
    launch: 0,
    ring: 0,
  },
  [
    ["The vault crash hits harder and wider.", { crash: 2.4, reach: 44 }],
    ["Air string +1: two air sweeps before you land.", { crash: 2.6, sweeps: 2 }],
    ["Landings send a shockwave along the floor.", { crash: 2.8, quake: 0.5, quakeRange: 96 }],
    ["Crash damage +7%, a stronger wave.", { crash: 3, quake: 0.6 }],
    ["Vault again in the air.", { crash: 3.2, airVault: 1 }],
    ["Vaults recharge faster; the crash launches.", { crash: 3.5, cooldown: 0.7, launch: 1 }],
    ["A stronger, longer shockwave that stuns.", { crash: 3.7, quake: 0.9, quakeRange: 130, quakeStun: 0.5 }],
    ["The crash burns.", { crash: 4, ring: 1 }],
  ],
);

/** Vault Strike: the vault crash grows, the air opens up, and landings shake the floor */
export const VAULT_STRIKE: SkillDef = {
  id: "y_vault",
  name: "Vault Strike",
  kind: "movement",
  risk: "timed",
  button: "I",
  text: "J in a vault's flight drives the glaive down harder where you land, and the air opens up.",
  levels,
  evolution: {
    partner: "y_ashen",
    name: "Skyfall",
    text: "The crash comes down as a burning meteor: a wide crater that burns, and a shockwave across the whole floor.",
    row: evolved(levels, "The crash is a meteor.", { crash: 8, reach: 60, quake: 1.2, quakeRange: 400, burn: 3 }),
  },
};
