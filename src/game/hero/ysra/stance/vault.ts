import { HERO_MOVE } from "../../../../constants/combat";
import { HIGH_VAULT_SPEED, VAULT, VAULT_SPEED, VAULT_TIMES } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import { riseSpeed } from "../../../../utils/math";
import { isHeld } from "../../../input";
import { skillValues } from "../../../skills/query";
import { hero, progress } from "../../../state";
import { dust } from "../../../world";
import { setState, settle } from "../../actions";
import { emitYsra } from "../events";
import { cutMove } from "./cut";
import { vaultLanding } from "./landing";
import { stance } from "./memory";
import { entryPose } from "./vaultEntry";

/** the vault is in the air and has not landed */
export const vaultFlying = (): boolean => hero.state === "vault" && stance.launched && !stance.landed;

/** nothing touches her from the plant until a moment past the top of the arc: the fall speed gravity builds in that moment */
export const vaultGuarded = (): boolean =>
  hero.state === "vault" &&
  !stance.landed &&
  (!stance.launched || (!hero.ground && hero.vy < HERO_MOVE.gravity * VAULT.gravity * VAULT.guardPastPeak));

/** seconds the vault takes to come back: Vault Strike's, shortened by spell haste */
const vaultCooldown = (): number => (skillValues("y_vault").cooldown ?? VAULT.cooldown) / progress.stats.haste;

/** the vault on the floor: plant the glaive ahead, toward a held side; `high` vaults higher and farther, over a big foe.
 *  The pose she showed last crosses into the plant. */
export function startVault(high: boolean): void {
  const h = hero;
  cutMove();
  const side = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
  stance.entry = entryPose(h.pose, side !== 0 && side !== h.face);
  if (side) h.face = side;
  h.running = false;
  h.vx = 0;
  stance.vaultCd = vaultCooldown();
  stance.vaultFull = stance.vaultCd;
  stance.high = high;
  Object.assign(stance, { launched: false, landed: false });
  setState("vault");
  sfx.swing(0.7);
}

/** leave the floor, or the haft in the air, rising this many pixels */
function launch(rise: number): void {
  const h = hero;
  const vy = -riseSpeed(rise, HERO_MOVE.gravity * VAULT.gravity);
  if (h.vy > vy) h.vy = vy;
  if (h.ground) h.liftTop = h.y - rise;
  h.ground = false;
  stance.launched = true;
  sfx.lunge();
}

/** Skyline: in the vault's flight, throw off the haft once more */
export function airVault(): void {
  stance.airVaults++;
  launch(VAULT.airPeak);
  hero.st = VAULT_TIMES.tuck;
  dust(hero.x, hero.y, 4);
}

/** plant, fly and land: the flight keeps one speed along the floor, and the landing crouch ends the vault */
export function runVault(): void {
  const h = hero;
  if (!stance.launched) {
    h.vx = 0;
    if (h.st < VAULT_TIMES.launch) return;
    dust(h.x + h.face * VAULT.plantAhead, h.y, 5);
    launch(stance.high ? VAULT.highPeak : VAULT.peak);
  }
  if (stance.landed) {
    h.vx = 0;
    if (h.st >= VAULT_TIMES.end) settle();
    return;
  }
  h.vx = h.face * (stance.high ? HIGH_VAULT_SPEED : VAULT_SPEED);
  emitYsra("travel", { x: h.x, y: h.y, from: "vault" });
  if (h.ground) {
    stance.landed = true;
    h.st = VAULT_TIMES.land;
    h.vx = 0;
    vaultLanding();
    return;
  }
  // a longer fall than the flat floor gives holds the last pose of the flight
  h.st = Math.min(h.st, VAULT_TIMES.land - 0.001);
}
