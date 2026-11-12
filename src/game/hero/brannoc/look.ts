import { FURY } from "../../../constants/brannoc/fury";
import { BERSERK, FRENZY } from "../../../constants/brannoc/moves";
import { HERO_COLORS as HC, PAL, SPARKS } from "../../../constants/palette";
import { H, W } from "../../../constants/stage";
import { blendScreen } from "../../../engine/frame";
import { PK } from "../../../types/particle";
import { mix } from "../../../utils/color";
import { game, hero, particles, rng, shown } from "../../state";
import { axeLook } from "../draw/greatAxe";
import { isBloodied } from "./fury";
import { brannoc } from "./memory";

/** where his mouth and shoulders are, from his feet facing right */
const MOUTH = { x: 4, y: -27 } as const;
const SHOULDERS = [-2, 2] as const;
/** the crimson tint reaches this far in from the scene's edges in Berserk */
const TINT_BAND = 28;

/**
 * Dress the rig for this frame, before he is drawn: Bloodied lights the war paint and turns his eyes to two crimson
 * pixels, Frenzy and Berserk pulse a crimson outline, crossing into Bloodied flashes it, and the axe edge glints after
 * a blow lands.
 */
export function dressBrannoc(): void {
  const base = shown.skin.colors;
  const bloodied = isBloodied();
  HC.scarfLight = bloodied ? PAL.rage[4] : base.scarfLight;
  HC.iris = bloodied ? PAL.rage[4] : base.iris;
  HC.pupil = bloodied ? PAL.rage[3] : base.pupil;
  HC.eyeWhite = bloodied ? PAL.rage[4] : base.eyeWhite;
  const raging = brannoc.frenzyT > 0 || brannoc.berserkT > 0;
  const pulse = 0.5 + 0.5 * Math.sin(game.t * 12);
  if (brannoc.rimFlash > 0) HC.outline = PAL.rage[4];
  else if (raging) HC.outline = mix(PAL.rage[1], PAL.rage[3], pulse);
  else HC.outline = base.outline;
  axeLook.glint = brannoc.glint > 0;
}

/** red steam: from his shoulders while Bloodied, from his mouth in Frenzy */
export function tickSteam(dt: number): void {
  brannoc.steamT -= dt;
  if (brannoc.steamT > 0 || hero.state === "dead") return;
  const bloodied = isBloodied();
  const frenzied = brannoc.frenzyT > 0;
  if (!bloodied && !frenzied) return;
  brannoc.steamT = frenzied ? FRENZY.breath : FURY.steam;
  const puff = (x: number, y: number) =>
    particles.spawn(PK.VAPOUR, hero.x + hero.face * x, hero.y + y, rng.range(-4, 4), -rng.range(10, 18), 0.5, {
      col: PAL.rage[3],
      size: rng.range(0.6, 1),
    });
  if (frenzied) puff(MOUTH.x, MOUTH.y);
  if (bloodied) for (const x of SHOULDERS) puff(x, -22);
  if (bloodied && rng.chance(0.5))
    particles.spawn(PK.SPARK, hero.x + hero.face * 10, hero.y - 8, 0, 20, 0.3, { sparks: SPARKS.rage });
}

/** Berserk tints the scene's edges crimson, strongest at the rim and gone `TINT_BAND` pixels in */
export function drawBerserkTint(): void {
  if (brannoc.berserkT <= 0 && hero.state !== "roar") return;
  const c = PAL.rage[2];
  for (let y = 0; y < H; y++) {
    const dy = Math.min(y, H - 1 - y);
    for (let x = 0; x < W; x++) {
      const d = Math.min(dy, x, W - 1 - x);
      if (d >= TINT_BAND) {
        x = W - 1 - TINT_BAND;
        continue;
      }
      blendScreen(x, y, c, BERSERK.tint * (1 - d / TINT_BAND));
    }
  }
}
