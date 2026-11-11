import { CLIPS } from "../constants/clips";
import { STAGGER } from "../constants/combat";
import { HP_BAR, MOTE_COLORS, STUN_STAR, STUN_STAR_DIM } from "../constants/effectColors";
import { ABILITY_COLOR, COIN_GOLD, ENEMY_COLORS, PAL } from "../constants/palette";
import { MOTE_PIXELS } from "../constants/pickupPixels";
import { ULT_LEVELS } from "../constants/ultimate";
import { ellipseRing, fleck, glow, glowLine, hairline, place, px } from "../engine/frame";
import { blit, detailCanvas } from "../engine/sprite";
import { fineRing, stampPixels } from "../game/effects/fine";
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
import { hex, mix, scale, WHITE } from "../utils/color";
import { clamp, TAU } from "../utils/math";
import { bladeAngle } from "../utils/poseFrame";
import { drawEliteGlow, drawEliteRing } from "./drawElite";
import { foeSprite } from "./foeSprites";

const heroSprite = detailCanvas(80, 76, 40, 62);
/** how solid the hero shows on the off beats of the blink while a blow cannot land */
const BLINK_ALPHA = 0.5;
/** the minion HP bar: its width in art pixels, and how far the lit top row of the fill leans toward white */
const BAR_WIDTH = 14;
const BAR_SHINE = 0.4;
/** the stun stars' orbit over a foe's head, and the arms of a star on the near side */
const STUN_ORBIT = { rx: 6, ry: 1.5, speed: 7 } as const;
const STAR_ARMS = [
  [0.75, 0],
  [-0.75, 0],
  [0, 0.75],
  [0, -0.75],
] as const;
/**
 * a struck foe flashes toward white: nearly white on the blow, easing back over the flash, and never a flat white
 * shape, so its outline and markings stay readable through a hit-stop
 */
const HIT_FLASH = { peak: 0.6, rest: 0.3, life: 0.1 } as const;
/** how far a struck hero flashes toward white, short of a flat white shape */
const HERO_FLASH = 0.75;
/** a foe stopped in time */
const STOPPED_TINT = hex("#7aa0a0");
/** ring colors for ultimate levels 3 and 4; levels 1 and 2 take the hero's own light */
const HIGH_LEVEL_COLORS = [hex("#ffe26b"), hex("#ff7ae0")];
const levelColor = (i: number) => (i < 2 ? skin.ramp[3 + i] : HIGH_LEVEL_COLORS[i - 2]);

/** a small HP bar over minions, gold for an elite; bosses use the bar at the bottom of the screen */
function drawMinionBar(e: Enemy): void {
  if (e.rank !== "minion" || e.hp >= e.max) return;
  const [cx] = enemyCenter(e);
  const bx = Math.round(cx - BAR_WIDTH / 2);
  const by = Math.round(enemyBox(e)[1] - 4);
  const fill = e.elite ? COIN_GOLD[3] : PAL.shadow[4];
  const shine = mix(fill, WHITE, BAR_SHINE);
  // two image pixel rows of fill, lit along the top, with a bright notch where the HP ends and a dark line under it
  const cells = BAR_WIDTH * 2;
  const filled = Math.max(1, Math.round(cells * (e.hp / e.max)));
  for (let i = 0; i < cells; i++) {
    const x = bx + i / 2;
    const tip = i === filled - 1;
    fleck(x, by, tip ? WHITE : i < filled ? shine : HP_BAR.empty);
    fleck(x, by + 0.5, tip ? shine : i < filled ? fill : HP_BAR.empty);
    fleck(x, by + 1, HP_BAR.edge);
  }
  for (const x of [bx - 0.5, bx + BAR_WIDTH]) {
    fleck(x, by, HP_BAR.edge);
    fleck(x, by + 0.5, HP_BAR.edge);
  }
}

/** a foe stopped in time is grey-teal; one inside a field that slows it is rimmed in teal */
function timeTint(e: Enemy): { tint: number; amount: number } {
  if (e.stopped > 0) return { tint: STOPPED_TINT, amount: 0.55 };
  const [cx, cy] = enemyCenter(e);
  return fieldPace(cx, cy, e.rank) < 1 ? { tint: PAL.hour[4], amount: 0.25 } : { tint: 0, amount: 0 };
}

/** two stars circling over a tripped or downed foe: a four point star on the near side of the orbit, a dim speck on the far side */
function drawStun(e: Enemy): void {
  if (e.stun <= 0 && !e.air) return;
  const [cx] = enemyCenter(e);
  const top = enemyBox(e)[1] - 3;
  const bright = e.air ? PAL.crystal[4] : STUN_STAR;
  const dim = e.air ? PAL.crystal[2] : STUN_STAR_DIM;
  for (let i = 0; i < 2; i++) {
    const g = game.t * STUN_ORBIT.speed + i * Math.PI;
    const x = cx + Math.cos(g) * STUN_ORBIT.rx;
    const y = top + Math.sin(g) * STUN_ORBIT.ry;
    if (Math.sin(g) < -0.2) {
      fleck(x + 0.25, y + 0.25, dim);
      continue;
    }
    px(x - 0.5, y - 0.5, bright);
    fleck(x, y, WHITE);
    for (const [ax, ay] of STAR_ARMS) fleck(x + ax - (ax < 0 ? 0.25 : 0), y + ay - (ay < 0 ? 0.25 : 0), bright);
  }
}

export function drawEnemies(): void {
  for (const e of game.enemies) {
    const kind = kindOf(e.type);
    const s = foeSprite(e);
    const winding =
      e.state === "wind" || e.state === "volley" || e.state === "charge" || (e.state === "leap" && e.vy === 0);
    const tremble = winding ? (Math.floor(game.t * 30) % 2 ? 1 : -1) : 0;
    // a struck foe is knocked away from the hero and eases back while its hit flash lasts
    const recoil = (Math.sign(e.x - hero.x) || 1) * STAGGER.kick * clamp(e.flash / HIT_FLASH.life);
    const at = e.x + tremble + recoil;
    const time = timeTint(e);
    const tint =
      e.flash > 0 ? WHITE : e.frozen > 0 ? PAL.ice[4] : time.amount ? time.tint : e.chill > 0 ? PAL.ice[3] : 0;
    const struck = HIT_FLASH.rest + (HIT_FLASH.peak - HIT_FLASH.rest) * clamp(e.flash / HIT_FLASH.life);
    const tintAmount = e.flash > 0 ? struck : e.frozen > 0 ? 0.5 : time.amount ? time.amount : e.chill > 0 ? 0.3 : 0;
    if (e.elite) drawEliteRing(e, s, at);
    blit(s, at, e.y, e.face < 0, { tint, tintAmount });
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
  const r = 3 + k * 4;
  ellipseRing(cx, cy, r, r * 1.1, c, 0.8);
  fineRing(cx, cy, r - 1.5, (r - 1.5) * 1.1, WHITE, k * 0.7);
  fineRing(cx, cy, r + 1.5, (r + 1.5) * 1.1, scale(c, 0.6), 0.5);
  // rune marks turning the other way around the ring: a white point with a short tail in the spell's color
  for (let i = 0; i < 6; i++) {
    const g = game.t * 6 + (i * TAU) / 6;
    const d = 7 + k * 2;
    fleck(cx + Math.cos(g) * d, cy + Math.sin(g) * d, WHITE, k * 1.5);
    fleck(cx + Math.cos(g - 0.12) * d, cy + Math.sin(g - 0.12) * d, c, k);
    fleck(cx + Math.cos(g - 0.24) * d, cy + Math.sin(g - 0.24) * d, c, k * 0.6);
  }
  glow(cx, cy, 18, c, 0.45 * k);
}

/** the ultimate gathering: a floor ring per level reached, motes drawn in, and pips for the levels the MP can pay for */
function drawChargeRing(): void {
  place();
  const level = hero.chargeLevel;
  for (let i = 0; i < level; i++) {
    const r = 10 + i * 6 + Math.sin(game.t * 8 + i) * 0.8;
    // the far side of each ring is a thin line, the near side a full one with a white seam inside it
    fineRing(hero.x, hero.y, r, r * 0.28, levelColor(i), 0.8, -1);
    ellipseRing(hero.x, hero.y, r, r * 0.28, levelColor(i), 0.9, 1);
    fineRing(hero.x, hero.y, r - 1, (r - 1) * 0.28, WHITE, 0.5, 1);
  }
  const c = levelColor(level - 1);
  glow(hero.x, hero.y - 18, 18 + level * 8, c, 0.25 + level * 0.08);
  for (let i = 0; i < 8; i++) {
    const g = game.t * 3 + (i * TAU) / 8;
    const d = 22 - ((game.t * 40 + i * 5) % 18);
    const mx = Math.cos(g);
    const my = Math.sin(g) * 0.7;
    // each mote is a point of light with a tail trailing outward as it is drawn in
    hairline(hero.x + mx * (d + 4), hero.y - 18 + my * (d + 4), hero.x + mx * d, hero.y - 18 + my * d, c, (u) => u);
    fleck(hero.x + mx * d, hero.y - 18 + my * d, WHITE);
  }
  for (let i = 0; i < ULT_LEVELS.length; i++) {
    const x = hero.x - 6 + i * 4;
    const y = hero.y - 40;
    const lit = i < level;
    const open = canAffordUlt(i + 1);
    px(x, y, lit ? levelColor(i) : open ? PAL.shadow[3] : HP_BAR.edge);
    px(x + 1, y, lit ? levelColor(i) : open ? PAL.shadow[3] : HP_BAR.edge);
    px(x, y + 1, lit ? WHITE : open ? PAL.shadow[2] : HP_BAR.edge);
    px(x + 1, y + 1, lit ? WHITE : open ? PAL.shadow[2] : HP_BAR.edge);
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
      alpha: (blink ? BLINK_ALPHA : 1) * shown,
      tint: WHITE,
      tintAmount: struck ? HERO_FLASH : 0,
      soft: blink,
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
    const x = o.x + 1;
    const y = o.y + 1;
    hairline(x - o.vx * 0.05, y - o.vy * 0.05, x, y, rp[2], (u) => u);
    stampPixels(MOTE_PIXELS, x, y, MOTE_COLORS[o.kind][twinkle ? 1 : 0]);
    glow(x, y, 8, rp[3], 0.45);
  }
}
