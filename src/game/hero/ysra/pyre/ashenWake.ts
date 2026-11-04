import { ASHEN_WAKE } from "../../../../constants/ysra/rites";
import { hasPerk } from "../../../progress";
import { clearCinders, layCinder } from "../../../spells/rites/cinder";
import { surfaceBelow } from "../../../world";
import { onYsra } from "../events";

/** where the last patch was laid, so patches fall every ASHEN_WAKE.spacing pixels of travel */
let lastX = Number.NaN;
/** a lunge's path waits for its end: only a full lunge leaves fire */
let lungePath: [number, number][] = [];

function lay(x: number, y: number): void {
  if (Math.abs(x - lastX) < ASHEN_WAKE.spacing) return;
  lastX = x;
  layCinder(x, surfaceBelow(x, y - 2));
}

/** Ashen Wake: vaults, dives and full lunges leave burning ground behind her */
export function listenAshenWake(): void {
  onYsra("travel", ({ x, y, from }) => {
    if (!hasPerk("ashenWake") || from === "charge") return;
    if (from === "lunge") lungePath.push([x, y]);
    else lay(x, y);
  });
  onYsra("land", ({ x, y }) => {
    if (!hasPerk("ashenWake")) return;
    lastX = Number.NaN;
    lay(x, y);
    lastX = Number.NaN;
  });
  onYsra("lungeEnd", ({ x, y, full }) => {
    const path = lungePath;
    lungePath = [];
    lastX = Number.NaN;
    if (!full || !hasPerk("ashenWake")) return;
    for (const [px, py] of path) lay(px, py);
    lay(x, y);
    lastX = Number.NaN;
  });
}

export function resetAshenWake(): void {
  lastX = Number.NaN;
  lungePath = [];
  clearCinders();
}
