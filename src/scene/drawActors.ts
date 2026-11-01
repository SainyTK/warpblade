import { ELEMENTS } from "../constants/combat";
import { CLIPS } from "../constants/hero";
import { ELEMENT_COLOR, ENEMY_COLORS, PAL } from "../constants/palette";
import { ellipseRing, glow, glowLine, line, place, px } from "../engine/frame";
import { blit, SpriteCanvas } from "../engine/sprite";
import { drawHusk } from "../game/enemies/drawHusk";
import { drawWisp } from "../game/enemies/drawWisp";
import { enemyCenter } from "../game/enemies/enemy";
import { drawHero } from "../game/hero/drawHero";
import { heroLook } from "../game/hero/look";
import { game, hero } from "../game/state";
import { hex, WHITE } from "../utils/color";
import { clamp, TAU } from "../utils/math";

const heroCanvas = new SpriteCanvas(80, 76, 40, 62);
const HP_BAR_EMPTY = hex("#120a1e");

export function drawEnemies(): void {
  for (const e of game.enemies) {
    const s = e.type === "wisp" ? drawWisp(e, game.t) : drawHusk(e, game.t);
    const tremble = e.state === "wind" ? (Math.floor(game.t * 30) % 2 ? 1 : -1) : 0;
    const tint = e.flash > 0 ? WHITE : e.frozen > 0 ? PAL.ice[4] : 0;
    const tintAmount = e.flash > 0 ? 1 : e.frozen > 0 ? 0.5 : 0;
    blit(s, e.x + tremble, e.y, e.face < 0, { tint, tintAmount });
    place();
    const [cx, cy] = enemyCenter(e);
    glow(cx, cy, e.type === "wisp" ? 16 : 22, PAL.shadow[3], e.state === "wind" ? 0.5 : 0.22);
    if (e.state === "wind") glow(cx + e.face * 3, cy - (e.type === "wisp" ? 1 : 6), 8, ENEMY_COLORS.eyeGlow, 0.6);
    if (e.hp < e.max) {
      const bx = Math.round(cx - 7);
      const by = Math.round(e.type === "wisp" ? e.y - 11 : e.y - 31);
      const filled = Math.round(14 * (e.hp / e.max));
      for (let i = 0; i < 14; i++) px(bx + i, by, i < filled ? PAL.shadow[4] : HP_BAR_EMPTY);
    }
  }
}

/** a rune ring turning at the casting hand while the spell gathers */
function drawCastRing(hand: [number, number]): void {
  const c = ELEMENT_COLOR[ELEMENTS[game.spell]];
  const k = clamp(hero.st / CLIPS.cast.hit);
  const [cx, cy] = [hand[0] + 2, hand[1]];
  ellipseRing(cx, cy, 3 + k * 4, (3 + k * 4) * 1.1, c, 0.8);
  for (let i = 0; i < 6; i++) {
    const g = game.t * 6 + (i * TAU) / 6;
    px(cx + Math.cos(g) * (7 + k * 2), cy + Math.sin(g) * (7 + k * 2), WHITE, k);
  }
  glow(cx, cy, 18, c, 0.45 * k);
}

export function drawHeroLayer(): void {
  const h = hero;
  for (const g of game.ghosts) {
    const k = g.life / g.max;
    blit(g.s, g.x, g.y, g.flip, { alpha: k * 0.6, tint: PAL.crystal[3], tintAmount: 0.65, soft: true });
    place();
    glow(g.x, g.y - 18, 14, PAL.crystal[3], 0.12 * k);
  }
  const flare = clamp((Math.abs(h.vx) / 115) * 3, 0, 3) + (h.ground ? 0 : 1.5);
  h.hand = drawHero(heroCanvas, h.pose, heroLook(flare));
  const blink = h.inv > 0 && h.state !== "warpStrike" && Math.floor(game.t * 20) % 2 === 0;
  const struck = h.state === "hurt" && h.st < 0.06;
  blit(heroCanvas, h.x, h.y, h.face < 0, { alpha: blink ? 0.45 : 1, tint: WHITE, tintAmount: struck ? 1 : 0 });
  // the crystal blade gives off a faint light, brighter mid-swing
  place(h.x, h.y, h.face < 0);
  if (h.hasSword) {
    const [hx, hy] = h.hand;
    const ca = Math.cos(h.pose.sa);
    const sn = Math.sin(h.pose.sa);
    const k = h.state.startsWith("atk") || h.state === "warpStrike" ? 0.3 : 0.12;
    glowLine(hx + ca * 3, hy + sn * 3, hx + ca * 16, hy + sn * 16, 6, PAL.crystal[3], k);
  }
  if (h.state === "cast" && h.st < CLIPS.cast.hit + 0.05) drawCastRing(h.hand);
}

export function drawPickups(): void {
  place();
  for (const o of game.pickups) {
    const rp = o.kind === "mp" ? PAL.crystal : PAL.heal;
    const twinkle = Math.sin(game.t * 20 + o.x) > 0;
    line(o.x - o.vx * 0.03, o.y - o.vy * 0.03, o.x, o.y, rp[2], 0.6);
    px(o.x, o.y, twinkle ? WHITE : rp[4]);
    px(o.x + 1, o.y, rp[4]);
    px(o.x, o.y + 1, rp[3]);
    px(o.x + 1, o.y + 1, rp[3]);
    glow(o.x, o.y, 8, rp[3], 0.45);
  }
}
