import type { CalderAbility } from "../../types/ability";
import { fireBlastCharge } from "./blastCharge";
import { fireChainShot } from "./chainShot";
import { firePhosphorShell } from "./phosphorShell";

/** a shell leaves the muzzle at (x, y) along `dir`, in its wide form when `wide` */
type ShellRelease = (x: number, y: number, dir: number, wide: boolean) => void;

/** the shells Calder's spell skills teach, by ability */
export const SHELLS: Readonly<Record<Exclude<CalderAbility, "slug" | "scatter">, ShellRelease>> = {
  flare: firePhosphorShell,
  chain: fireChainShot,
  charge: fireBlastCharge,
};
