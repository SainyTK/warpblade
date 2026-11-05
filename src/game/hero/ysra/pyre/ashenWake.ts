import { ASHEN_WAKE } from "../../../../constants/ysra/rites";
import { hasPerk } from "../../../progress";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";
import { clearCinders, layCinder } from "../../../spells/rites/cinder";
import { surfaceBelow } from "../../../world";
import { onYsra } from "../events";

/** lastX: where the last patch was laid, so patches fall every ASHEN_WAKE.spacing pixels of travel;
 *  lungePath: a lunge's path waits for its end, since only a full lunge leaves fire */
const wake: { lastX: number; lungePath: [number, number][] } = { lastX: Number.NaN, lungePath: [] };
rememberPerSeat(objectMemory(wake));

function lay(x: number, y: number): void {
  if (Math.abs(x - wake.lastX) < ASHEN_WAKE.spacing) return;
  wake.lastX = x;
  layCinder(x, surfaceBelow(x, y));
}

/** Ashen Wake: vaults, dives and full lunges leave burning ground behind her */
export function listenAshenWake(): void {
  onYsra("travel", ({ x, y, from }) => {
    if (!hasPerk("ashenWake") || from === "charge") return;
    if (from === "lunge") wake.lungePath.push([x, y]);
    else lay(x, y);
  });
  onYsra("land", ({ x, y }) => {
    if (!hasPerk("ashenWake")) return;
    wake.lastX = Number.NaN;
    lay(x, y);
    wake.lastX = Number.NaN;
  });
  onYsra("lungeEnd", ({ x, y, full }) => {
    const path = wake.lungePath;
    wake.lungePath = [];
    wake.lastX = Number.NaN;
    if (!full || !hasPerk("ashenWake")) return;
    for (const [px, py] of path) lay(px, py);
    lay(x, y);
    wake.lastX = Number.NaN;
  });
}

export function resetAshenWake(): void {
  wake.lastX = Number.NaN;
  wake.lungePath = [];
  clearCinders();
}
