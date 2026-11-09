import { CLIPS } from "../constants/clips";
import { ABILITY_COLOR, COIN_GOLD, ENEMY_COLORS, PAL } from "../constants/palette";
import { ULT_LEVELS } from "../constants/ultimate";
import { ellipseRing, glow, glowLine, line, place, px } from "../engine/frame";
import { blit, detailCanvas } from "../engine/sprite";
import { enemyBox, enemyCenter } from "../game/enemies/enemy";
import { kindOf } from "../game/enemies/kinds";
import { drawHero } from "../game/hero/drawHero";
import { shownKit } from "../game/hero/kits";
import { heroLook } from "../game/hero/look";
import { skin } from "../game/hero/skin";
import { canAffordUlt } from "../game/hero/ultimate";
import { game, hero } from "../game/state";
import { fieldPace } from "../game/timeFields";
import type { Enemy } from "../types/enemy";
import { hex, WHITE } from "../utils/color";
import { clamp, TAU } from "../utils/math";
import { bladeAngle } from "../utils/poseFrame";
import { drawEliteGlow, drawEliteRing } from "./drawElite";

const heroSprite = detailCanvas(80, 76, 40, 62);
const HP_BAR_EMPTY = hex("#120a1e");
const STUN_STAR = hex("#ffe26b");
/** a foe stopped in time */
const STOPPED_TINT = hex("#7aa0a0");
/** ring colors for ultimate levels 3 and 4; levels 1 and 2 take the hero's own light */
const HIGH_LEVEL_COLORS = [hex("#ffe26b"), hex("#ff7ae0")];
const levelColor = (i: number) => (i < 2 ? skin.ramp[3 + i] : HIGH_LEVEL_COLORS[i - 2]);

/** a small HP bar over minions, gold for an elite; bosses use the bar at the bottom of the screen */
function drawMinionBar(e: Enemy): void {
  if (e.rank !== "minion" || e.hp >= e.max) return;
  const [cx] = enemyCenter(e);
  const bx = Math.round(cx - 7);
  const by = Math.round(enemyBox(e)[1] - 4);
  const filled = Math.round(14 * (e.hp / e.max));
  const fill = e.elite ? COIN_GOLD[3] : PAL.shadow[4];
  for (let i = 0; i < 14; i++) px(bx + i, by, i < filled ? fill : HP_BAR_EMPTY);
}

/** a foe stopped in time is grey-teal; one inside a field that slows it is rimmed in teal */
function timeTint(e: Enemy): { tint: number; amount: number } {
  if (e.stopped > 0) return { tint: STOPPED_TINT, amount: 0.55 };
  const [cx, cy] = enemyCenter(e);
  return fieldPace(cx, cy, e.rank) < 1 ? { tint: PAL.hour[4], amount: 0.25 } : { tint: 0, amount: 0 };
}

/** two stars circling over a tripped or downed foe */
function drawStun(e: Enemy): void {
  if (e.stun <= 0 && !e.air) return;
  const [cx] = enemyCenter(e);
  const top = enemyBox(e)[1] - 3;
  for (let i = 0; i < 2; i++) {
    const g = game.t * 7 + i * Math.PI;
    px(cx + Math.cos(g) * 6, top + Math.sin(g) * 1.5, e.air ? PAL.crystal[4] : STUN_STAR);
  }
}

export function drawEnemies(): void {
  for (const e of game.enemies) {
    const kind = kindOf(e.type);
    const s = kind.draw(e, game.t);
    const winding =
      e.state === "wind" || e.state === "volley" || e.state === "charge" || (e.state === "leap" && e.vy === 0);
    const tremble = winding ? (Math.floor(game.t * 30) % 2 ? 1 : -1) : 0;
    const time = timeTint(e);
    const tint =
      e.flash > 0 ? WHITE : e.frozen > 0 ? PAL.ice[4] : time.amount ? time.tint : e.chill > 0 ? PAL.ice[3] : 0;
    const tintAmount = e.flash > 0 ? 1 : e.frozen > 0 ? 0.5 : time.amount ? time.amount : e.chill > 0 ? 0.3 : 0;
    if (e.elite) drawEliteRing(e, s, e.x + tremble);
    blit(s, e.x + tremble, e.y, e.face < 0, { tint, tintAmount });
    place();
    const [cx, cy] = enemyCenter(e);
    glow(cx, cy, kind.glow.radius, kind.glow.color, winding ? 0.5 : 0.22);
    if (e.elite) drawEliteGlow(e);
    if (winding) glow(cx + e.face * 3, cy + kind.glow.eyeY, 8, ENEMY_COLORS.eyeGlow, 0.6);
    drawMinionBar(e);
    drawStun(e);
  }
}

/** a rune ring turning at the casting hand while the spell gathers */
function drawCastRing(hand: [number, number]): void {
  const c = ABILITY_COLOR[hero.castAbility];
  const k = clamp(hero.st / CLIPS.cast.hit);
  const [cx, cy] = [hand[0] + 2, hand[1]];
  ellipseRing(cx, cy, 3 + k * 4, (3 + k * 4) * 1.1, c, 0.8);
  for (let i = 0; i < 6; i++) {
    const g = game.t * 6 + (i * TAU) / 6;
    px(cx + Math.cos(g) * (7 + k * 2), cy + Math.sin(g) * (7 + k * 2), WHITE, k);
  }
  glow(cx, cy, 18, c, 0.45 * k);
}

/** the ultimate gathering: a floor ring per level reached, motes drawn in, and pips for the levels the MP can pay for */
function drawChargeRing(): void {
  place();
  const level = hero.chargeLevel;
  for (let i = 0; i < level; i++) {
    const r = 10 + i * 6 + Math.sin(game.t * 8 + i) * 0.8;
    ellipseRing(hero.x, hero.y, r, r * 0.28, levelColor(i), 0.9);
  }
  const c = levelColor(level - 1);
  glow(hero.x, hero.y - 18, 18 + level * 8, c, 0.25 + level * 0.08);
  for (let i = 0; i < 8; i++) {
    const g = game.t * 3 + (i * TAU) / 8;
    const d = 22 - ((game.t * 40 + i * 5) % 18);
    px(hero.x + Math.cos(g) * d, hero.y - 18 + Math.sin(g) * d * 0.7, c, 0.8);
  }
  for (let i = 0; i < ULT_LEVELS.length; i++) {
    const x = hero.x - 6 + i * 4;
    const y = hero.y - 40;
    const lit = i < level;
    const open = canAffordUlt(i + 1);
    px(x, y, lit ? levelColor(i) : open ? PAL.shadow[3] : HP_BAR_EMPTY);
    px(x + 1, y, lit ? levelColor(i) : open ? PAL.shadow[3] : HP_BAR_EMPTY);
    px(x, y + 1, lit ? WHITE : open ? PAL.shadow[2] : HP_BAR_EMPTY);
    px(x + 1, y + 1, lit ? WHITE : open ? PAL.shadow[2] : HP_BAR_EMPTY);
  }
}

export function drawHeroLayer(): void {
  const h = hero;
  for (const g of game.ghosts) {
    const k = g.life / g.max;
    blit(g.s, g.x, g.y, g.flip, { alpha: k * 0.6, tint: skin.glow, tintAmount: 0.65, soft: true });
    place();
    glow(g.x, g.y - 18, 14, skin.glow, 0.12 * k);
  }
  if (h.state === "charge") drawChargeRing();
  shownKit().drawBack?.();
  const flare = clamp((Math.abs(h.vx) / 115) * 3, 0, 3) + (h.ground ? 0 : 1.5);
  h.hand = drawHero(heroSprite, h.pose, heroLook(flare));
  const blink = h.inv > 0 && h.state !== "warpStrike" && h.state !== "ultimate" && Math.floor(game.t * 20) % 2 === 0;
  const struck = h.state === "hurt" && h.st < 0.06;
  const shown = shownKit().heroAlpha?.() ?? 1;
  if (shown > 0)
    blit(heroSprite, h.x, h.y, h.face < 0, {
      alpha: (blink ? 0.45 : 1) * shown,
      tint: WHITE,
      tintAmount: struck ? 1 : 0,
    });
  // the crystal blade gives off a faint light, brighter mid-swing
  place(h.x, h.y, h.face < 0);
  if (h.hasSword) {
    const [hx, hy] = h.hand;
    const angle = bladeAngle(h.pose);
    const ca = Math.cos(angle);
    const sn = Math.sin(angle);
    const k = h.state === "move" || h.state === "warpStrike" || h.state === "charge" ? 0.3 : 0.12;
    glowLine(hx + ca * 3, hy + sn * 3, hx + ca * (skin.reach - 1), hy + sn * (skin.reach - 1), 6, skin.glow, k);
  }
  if (h.state === "cast" && h.st < CLIPS.cast.hit + 0.05) drawCastRing(h.hand);
  shownKit().draw?.();
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
