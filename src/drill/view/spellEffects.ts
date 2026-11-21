import { H } from "../../constants/stage";
import { disc, ellipseRing, glow, glowLine, hairline, place, polygon, sparkle } from "../../engine/frame";
import type { DrillSpell, ElementImpact, ElementProjectile } from "../../types/drill";
import { clamp, ease, smooth, TAU } from "../../utils/math";
import { SPELL_IMPACT_TIME } from "../constants";

export function drawElementProjectile(bolt: ElementProjectile): void {
  const { spell, x, y, face, distance } = bolt;
  if (spell.drawBolt) {
    spell.drawBolt(bolt);
    return;
  }
  const { color, core } = spell;
  place(x, y, face < 0);
  glow(0, 0, 16, color, 0.63);
  if (spell.look === "flame") {
    const tail = 14 + Math.sin(distance * 0.28) * 3;
    polygon(
      [
        [-tail, 2],
        [-6, -3],
        [0, -5],
        [5, -2],
        [5, 2],
        [0, 5],
        [-7, 4],
      ],
      color,
    );
    disc(1, 0, 3.35, core, 0.94);
    for (let i = 0; i < 4; i++) {
      const px = -8 - i * 3.5;
      const py = Math.sin(distance * 0.33 + i) * (i + 1);
      hairline(px, py, px - 5, py + 1, color, 0.66);
    }
  } else {
    polygon(
      [
        [-15, 0],
        [-5, -4],
        [6, -1],
        [2, 3],
        [-5, 4],
      ],
      color,
    );
    polygon(
      [
        [-9, 0],
        [-3, -2],
        [5, -1],
        [1, 2],
      ],
      core,
    );
    sparkle(-12, Math.sin(distance / 9) * 4, 2, color, core, 0.58);
  }
  place();
}

function burst(blast: ElementImpact, progress: number, fade: number): void {
  const { spell, fromSword } = blast;
  const { color, core, radius } = spell;
  const expand = ease.outCubic(progress);
  const size = 4 + expand * radius * (fromSword ? 0.58 : 1);
  glow(0, 0, 12 + size, color, 0.77 * fade);
  ellipseRing(0, 1, size, size * 0.62, color, fade * 0.79);
  disc(0, 0, 5.2 * (1 - progress), core, fade);
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * TAU + 0.36;
    const length = size * (0.55 + (i % 4) * 0.13);
    const x = Math.cos(angle) * length;
    const y = Math.sin(angle) * length * 0.88;
    if (spell.look === "shard") {
      polygon(
        [
          [x - 1.2, y + 3],
          [x - 1.6, y - 1],
          [x + 1, y - 4],
          [x + 2, y],
        ],
        i % 3 ? color : core,
        fade,
      );
    } else if (spell.look === "spark") {
      hairline(x * 0.48, y * 0.48, x - 2, y + 3, core, fade);
      hairline(x - 2, y + 3, x * 1.3, y * 1.2, color, fade);
    } else {
      hairline(x, y, x * 1.29, y * 1.27 - 1, i % 3 ? color : core, fade);
    }
  }
}

function thunder(spell: DrillSpell, age: number): void {
  const { color, core, delay, radius } = spell;
  if (age < delay) {
    const alpha = smooth(0, delay, age);
    ellipseRing(0, -1, radius, 5, color, 0.65 * alpha);
    glow(0, -4, radius, color, alpha * 0.42);
    return;
  }
  const progress = clamp((age - delay) / (SPELL_IMPACT_TIME - delay));
  const alpha = 1 - progress;
  const path = [
    [-13, -H],
    [-2, -101],
    [-9, -79],
    [5, -57],
    [-3, -35],
    [5, -23],
    [0, -4],
  ];
  for (let i = 1; i < path.length; i++) {
    const [x0, y0] = path[i - 1];
    const [x1, y1] = path[i];
    glowLine(x0, y0, x1, y1, 12, color, 0.66 * alpha);
    hairline(x0, y0, x1, y1, core, alpha);
    hairline(x0 + 0.5, y0, x1 + 0.5, y1, 0xfffaff, alpha);
    if (i % 2 === 0) {
      hairline(x1, y1, x1 + (i < 4 ? -11 : 11), y1 + 8, color, 0.8 * alpha);
    }
  }
  ellipseRing(0, -2, radius * ease.outCubic(progress), 4 + progress, color, alpha);
  sparkle(0, -10, 7 + progress * 5, color, core, alpha);
}

export function drawElementImpact(blast: ElementImpact): void {
  const { x, y, spell, age, face, fromSword } = blast;
  if (spell.drawBlast) {
    spell.drawBlast(blast);
    return;
  }
  place(x, y, face < 0);
  if (spell.speed === null && spell.look === "spark" && !fromSword) {
    thunder(spell, age);
  } else {
    const progress = clamp(age / SPELL_IMPACT_TIME);
    burst(blast, progress, 1 - smooth(0.12, 1, progress));
  }
  place();
}
