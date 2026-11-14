import type { SpriteCanvas } from "../../../../engine/sprite";
import { arrow, crescent, evolvedStar, sparkle } from "../../../../ui/skills/icons/parts";
import { SKILL } from "../../constants/skills/ids";
import { ICON } from "./palette";
import { foe, glint, inkStroke, katana, moon, ring, scabbard } from "./parts";
import { crane, paper } from "./skills";

/** each evolved form: the skill's own marks grown */
const EVOLVED: Record<string, (s: SpriteCanvas) => void> = {
  /** Moonlit Draw: the draw under a moon, two ink cuts flying */
  [`${SKILL.edge}_evo`]: (s) => {
    moon(s, 4, 4, 3);
    inkStroke(s, 4, 9, 15, 9, 1);
    inkStroke(s, 6, 13, 15, 13, 0.8);
    katana(s, 3, 12, 14, 6);
  },
  /** Perfect Stillness: two gold glints at the mouth */
  [`${SKILL.clean}_evo`]: (s) => {
    scabbard(s, 1, 12, 11, 9);
    katana(s, 14, 6, 11, 9);
    glint(s, 10, 8, 2.5, ICON.gold);
    glint(s, 5, 5, 2, ICON.gold);
  },
  /** Full Circle: a ring of ink round the blade */
  [`${SKILL.reverse}_evo`]: (s) => {
    ring(s, 8, 9, 6, ICON.inkMid, 0.6);
    katana(s, 4, 14, 13, 2);
  },
  /** Spreading Ink: the lines splashing onto a second foe */
  [`${SKILL.flow}_evo`]: (s) => {
    foe(s, 6, 9, 3.5);
    foe(s, 12, 11, 2.5);
    inkStroke(s, 1, 7, 15, 12, 0.7);
    inkStroke(s, 2, 12, 11, 6, 0.7);
  },
  /** Moonfall: the moon and a wide ring on the floor */
  [`${SKILL.falling}_evo`]: (s) => {
    moon(s, 8, 5, 4);
    inkStroke(s, 1, 14, 15, 14, 1.2);
    arrow(s, 8, 8, 8, 13, ICON.pale, 2);
  },
  /** Thousand Paces: three katanas in flight */
  [`${SKILL.pass}_evo`]: (s) => {
    katana(s, 1, 4, 13, 4);
    katana(s, 3, 9, 15, 9);
    katana(s, 1, 14, 13, 14);
  },
  /** Ghost Passage: a dash through a foe, cut twice */
  [`${SKILL.step}_evo`]: (s) => {
    foe(s, 8, 8, 3.5);
    arrow(s, 1, 13, 15, 13, ICON.pale, 2.5);
    inkStroke(s, 4, 5, 12, 11, 0.7);
    inkStroke(s, 4, 11, 12, 5, 0.7);
  },
  /** Ink Horizon: the stroke running off to the edge */
  [`${SKILL.stroke}_evo`]: (s) => {
    inkStroke(s, 1, 10, 15, 10, 2);
    inkStroke(s, 6, 5, 15, 5, 1);
    glint(s, 14, 10, 2);
  },
  /** Tide Moon: a crescent as tall as the icon */
  [`${SKILL.crescent}_evo`]: (s) => {
    crescent(s, 4, 8, 7.5, -1.4, 1.4, ICON.inkMid);
    crescent(s, 9, 8, 6, -1.2, 1.2, ICON.ink);
  },
  /** Monsoon: two clouds raining */
  [`${SKILL.rain}_evo`]: (s) => {
    s.begin();
    s.dot(4, 4, 2.6, ICON.ink);
    s.dot(12, 4, 2.6, ICON.ink);
    s.commit();
    for (const [x, y] of [
      [3, 10],
      [5, 14],
      [11, 10],
      [13, 14],
    ] as const)
      glint(s, x, y, 1, ICON.pale);
  },
  /** Mirror Lake: the still line and its reflection */
  [`${SKILL.still}_evo`]: (s) => {
    scabbard(s, 2, 6, 14, 4);
    inkStroke(s, 1, 9, 15, 9, 0.6);
    scabbard(s, 2, 12, 14, 14);
  },
  /** Weeping Moon: the weeping foe bursting */
  [`${SKILL.weep}_evo`]: (s) => {
    foe(s, 8, 8, 4);
    sparkle(s, 8, 8, 5, ICON.pale);
    inkStroke(s, 2, 14, 14, 14, 0.8);
  },
  /** Indelible: a stain that keeps its line */
  [`${SKILL.stain}_evo`]: (s) => {
    ring(s, 8, 8, 5.5, ICON.inkMid, 0.7);
    inkStroke(s, 2, 10, 14, 6, 0.8);
    inkStroke(s, 2, 6, 14, 10, 0.8);
  },
  /** Ink Sea: a wide band of ink with foes in it */
  [`${SKILL.trail}_evo`]: (s) => {
    inkStroke(s, 1, 12, 15, 12, 2.6);
    foe(s, 5, 7, 2.2);
    foe(s, 11, 7, 2.2);
  },
  /** Thousand Cranes: three cranes */
  [`${SKILL.crane}_evo`]: (s) => {
    crane(s, 6, 5, 0.9);
    crane(s, 11, 9, 0.9);
    crane(s, 5, 13, 0.9);
  },
  /** Twin Moon: two shades either side of a foe */
  [`${SKILL.shade}_evo`]: (s) => {
    foe(s, 8, 9, 3);
    for (const x of [2, 14]) {
      s.begin();
      s.stroke(x, 5, x, 14, 1.2, ICON.ink);
      s.dot(x, 4, 1.4, ICON.ink);
      s.commit();
    }
    inkStroke(s, 2, 8, 14, 10, 0.6);
  },
  /** Paper Storm: a wide ring of blades */
  [`${SKILL.paper}_evo`]: (s) => {
    ring(s, 8, 8, 6.5, ICON.inkMid, 0.3);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      paper(s, 8 + Math.cos(a) * 6, 8 + Math.sin(a) * 6, a + 1.5);
    }
  },
  /** Boundless Breath: breaths in a ring */
  [`${SKILL.breath}_evo`]: (s) => {
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
      s.begin();
      s.dot(8 + Math.cos(a) * 5, 8 + Math.sin(a) * 5, 1.4, ICON.pale);
      s.shadeEdges(ICON.pale, ICON.edge, ICON.moon);
      s.commit();
    }
  },
  /** Empty Mind: an open circle with nothing in it but light */
  [`${SKILL.calm}_evo`]: (s) => {
    ring(s, 8, 8, 6, ICON.pale, 0.5);
    ring(s, 8, 8, 3.5, ICON.inkMid, 0.4);
    glint(s, 8, 8, 2);
  },
  /** New Moon: a dark moon with a white rim, crossed twice */
  [`${SKILL.moon}_evo`]: (s) => {
    s.begin();
    s.dot(8, 8, 6, ICON.ink);
    s.shadeEdges(ICON.ink, ICON.edge, ICON.inkMid);
    s.commit();
    inkStroke(s, 1, 4, 15, 12, 0.8);
    inkStroke(s, 1, 12, 15, 4, 0.8);
  },
};

/** every evolved icon with the gold star drawn last */
export const SAYA_EVOLVED_ICONS: Record<string, (s: SpriteCanvas) => void> = Object.fromEntries(
  Object.entries(EVOLVED).map(([id, draw]) => [
    id,
    (s: SpriteCanvas) => {
      draw(s);
      evolvedStar(s);
    },
  ]),
);
