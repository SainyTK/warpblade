import type { SpriteCanvas } from "../../../../engine/sprite";
import { arc, arrow, crescent } from "../../../../ui/skills/icons/parts";
import { SKILL } from "../../constants/skills/ids";
import { ICON } from "./palette";
import { foe, glint, inkStroke, katana, moon, ring, scabbard } from "./parts";

/** a small ink drop */
function drop(s: SpriteCanvas, x: number, y: number): void {
  s.begin();
  s.dot(x, y, 1, ICON.ink);
  s.set(x - 0.4, y - 0.6, ICON.edge);
  s.commit();
}

/** a folded crane of ink with a white edge */
export function crane(s: SpriteCanvas, x: number, y: number, k = 1): void {
  s.begin();
  s.poly(
    [
      [x - 5 * k, y + 1 * k],
      [x, y - 1 * k],
      [x + 1 * k, y + 2 * k],
    ],
    ICON.ink,
  );
  s.poly(
    [
      [x - 1 * k, y],
      [x + 4 * k, y - 4 * k],
      [x + 2 * k, y + 1 * k],
    ],
    ICON.inkMid,
  );
  s.commit();
  s.begin();
  s.hairline(x - 5 * k, y + 1 * k - 0.5, x, y - 1 * k - 0.5, ICON.edge);
  s.commit(false);
}

/** a paper blade: a pale slip with an ink edge */
export function paper(s: SpriteCanvas, x: number, y: number, a: number): void {
  const dx = Math.cos(a) * 3.5;
  const dy = Math.sin(a) * 3.5;
  s.begin();
  s.stroke(x - dx, y - dy, x + dx, y + dy, 0.8, ICON.pale);
  s.commit();
  s.begin();
  s.hairline(x - dx, y - dy + 0.8, x + dx, y + dy + 0.8, ICON.ink);
  s.commit(false);
}

/** Saya's 20 skill icons */
export const SAYA_SKILL_BASE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the katana leaving its scabbard in a level stroke */
  [SKILL.edge]: (s) => {
    scabbard(s, 1, 13, 9, 11);
    inkStroke(s, 4, 8, 15, 7, 1.1);
    katana(s, 5, 11, 15, 5);
  },
  /** the hilt at the scabbard's mouth with a gold glint: the click */
  [SKILL.clean]: (s) => {
    scabbard(s, 1, 13, 10, 10);
    katana(s, 15, 7, 10, 10);
    glint(s, 9, 6, 3, ICON.gold);
  },
  /** a rising stroke and the crescent it leaves behind */
  [SKILL.reverse]: (s) => {
    crescent(s, 8, 9, 6, 2.2, 5.6, ICON.inkMid);
    katana(s, 4, 14, 13, 2);
  },
  /** a foe holding three stored lines */
  [SKILL.flow]: (s) => {
    foe(s, 8, 9, 4.5);
    inkStroke(s, 3, 6, 13, 8, 0.7);
    inkStroke(s, 3, 10, 13, 9, 0.7);
    inkStroke(s, 4, 13, 12, 5, 0.7);
  },
  /** the katana drawn downward over a crescent moon */
  [SKILL.falling]: (s) => {
    moon(s, 5, 5, 4);
    katana(s, 3, 3, 13, 13);
    arc(s, 8, 15, 6, Math.PI, Math.PI * 2, ICON.inkMid);
  },
  /** the thrown katana cutting through a foe */
  [SKILL.pass]: (s) => {
    foe(s, 9, 9, 3.5);
    inkStroke(s, 1, 9, 15, 9, 0.9);
    katana(s, 2, 9, 15, 9);
  },
  /** a dash through a foe, leaving a line in it */
  [SKILL.step]: (s) => {
    foe(s, 8, 9, 3.5);
    arrow(s, 1, 12, 15, 12, ICON.pale, 2.5);
    inkStroke(s, 4, 7, 12, 10, 0.7);
  },
  /** a long brush stroke along the floor */
  [SKILL.stroke]: (s) => {
    inkStroke(s, 1, 10, 15, 10, 2);
    arrow(s, 2, 5, 14, 5, ICON.pale, 2.5);
  },
  /** a tall ink crescent flying right */
  [SKILL.crescent]: (s) => {
    crescent(s, 5, 8, 7, -1.2, 1.2, ICON.inkMid);
    arrow(s, 1, 8, 7, 8, ICON.pale, 2);
  },
  /** a cloud of ink and its falling drops */
  [SKILL.rain]: (s) => {
    s.begin();
    s.dot(5, 4, 3, ICON.ink);
    s.dot(10, 4, 3.5, ICON.ink);
    s.commit();
    drop(s, 4, 10);
    drop(s, 8, 13);
    drop(s, 12, 10);
  },
  /** still water: a level line with the hand on the hilt above it */
  [SKILL.still]: (s) => {
    inkStroke(s, 1, 12, 15, 12, 0.6);
    scabbard(s, 2, 8, 14, 6);
    glint(s, 12, 4, 2);
  },
  /** a cut foe weeping ink */
  [SKILL.weep]: (s) => {
    foe(s, 8, 7, 4);
    inkStroke(s, 3, 4, 13, 9, 0.7);
    drop(s, 6, 13);
    drop(s, 10, 14);
  },
  /** a stain spreading round a stored line */
  [SKILL.stain]: (s) => {
    s.begin();
    s.dot(8, 8, 5.5, ICON.inkMid);
    s.commit();
    s.begin();
    s.dot(8, 8, 3.5, ICON.ink);
    s.commit();
    inkStroke(s, 2, 10, 14, 6, 0.6);
  },
  /** an ink trail on the floor with heat rising off it */
  [SKILL.trail]: (s) => {
    inkStroke(s, 1, 12, 15, 12, 2);
    for (const x of [4, 8, 12]) arc(s, x, 7, 2.2, Math.PI, Math.PI * 2, ICON.pale, 0.45);
  },
  /** an ink crane */
  [SKILL.crane]: (s) => crane(s, 8, 9, 1.4),
  /** a shade of her: an ink figure drawing beside a foe */
  [SKILL.shade]: (s) => {
    foe(s, 11, 9, 3.5);
    s.begin();
    s.stroke(4, 5, 4, 14, 1.4, ICON.ink);
    s.dot(4, 4, 1.6, ICON.ink);
    s.commit();
    inkStroke(s, 4, 9, 15, 8, 0.8);
  },
  /** paper blades turning round a point */
  [SKILL.paper]: (s) => {
    ring(s, 8, 8, 5, ICON.inkMid, 0.3);
    paper(s, 8, 3, 0);
    paper(s, 13, 9, 1.2);
    paper(s, 4, 11, 2.4);
  },
  /** three breaths rising */
  [SKILL.breath]: (s) => {
    for (const [x, y] of [
      [4, 12],
      [8, 8],
      [12, 4],
    ] as const) {
      s.begin();
      s.dot(x, y, 1.6, ICON.pale);
      s.shadeEdges(ICON.pale, ICON.edge, ICON.moon);
      s.commit();
    }
  },
  /** a calm circle with the full moon in it */
  [SKILL.calm]: (s) => {
    ring(s, 8, 8, 6, ICON.inkMid, 0.4);
    s.begin();
    s.dot(8, 8, 3, ICON.pale);
    s.shadeEdges(ICON.pale, ICON.edge, ICON.moon);
    s.commit();
  },
  /** a crescent moon crossed by lines */
  [SKILL.moon]: (s) => {
    moon(s, 8, 8, 6);
    inkStroke(s, 1, 4, 15, 12, 0.8);
    inkStroke(s, 1, 12, 15, 4, 0.8);
  },
};
