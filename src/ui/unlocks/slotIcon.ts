import { hex } from "../../utils/color";
import { pixelIconUrl } from "../pixelIconUrl";

const SIZE = 16;
/** the socket's outer radius and rim width, in pixels from the centre */
const SOCKET = { radius: 6.6, rim: 1.6 } as const;
const COLORS = {
  o: hex("#0a0612"),
  h: hex("#9a94c4"),
  r: hex("#4a4280"),
  w: hex("#15122a"),
  c: hex("#7fe3ff"),
  b: hex("#e0ac48"),
};

/** an empty socket on a 16 by 16 grid, round for a relic and a diamond for a charm, with a plus in its well */
function socketRows(slot: "relic" | "charm"): string[] {
  const plus = slot === "relic" ? "c" : "b";
  const rows: string[] = [];
  for (let y = 0; y < SIZE; y++) {
    let row = "";
    for (let x = 0; x < SIZE; x++) {
      const dx = x + 0.5 - SIZE / 2;
      const dy = y + 0.5 - SIZE / 2;
      const d = slot === "relic" ? Math.hypot(dx, dy) : (Math.abs(dx) + Math.abs(dy)) * 0.78;
      const cross = (Math.abs(dx) < 1 && Math.abs(dy) < 3) || (Math.abs(dy) < 1 && Math.abs(dx) < 3);
      if (d > SOCKET.radius + 1) row += ".";
      else if (d > SOCKET.radius) row += "o";
      else if (d > SOCKET.radius - SOCKET.rim) row += dx + dy < -2 ? "h" : "r";
      else row += cross ? plus : "w";
    }
    rows.push(row);
  }
  return rows;
}

/** the icon of a relic or charm slot, drawn once */
export const slotIconUrl = (slot: "relic" | "charm"): string => pixelIconUrl(`slot-${slot}`, socketRows(slot), COLORS);
