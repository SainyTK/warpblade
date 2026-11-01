import { COST, ELEMENTS, HERO_MOVE as M, MAX_MP, MP_REGEN } from "../../constants/combat";
import { CLIPS, POSES } from "../../constants/hero";
import { ELEMENT_COLOR, PAL, WORLD_COLORS } from "../../constants/palette";
import { GROUND, PLATFORMS, W } from "../../constants/stage";
import { sfx } from "../../services/audio";
import { PK } from "../../types/particle";
import { approach, clamp, TAU } from "../../utils/math";
import { createGlint } from "../effects/flash";
import { createFloorRing } from "../effects/floorRing";
import { isHeld, take } from "../input";
import { resetRun } from "../run";
import { castBolt } from "../spells/bolt";
import { castFire } from "../spells/fire";
import { castIce } from "../spells/ice";
import { game, hero, lights, particles, ponytail, rng, scarf } from "../state";
import { dust, surfaceBelow } from "../world";
import { doWarp, ghostCanvas, leaveHang, releaseSword, setState, startAttack, startThrow } from "./actions";
import { crossCut, fallingSmash, risingCut } from "./attackHits";
import { drawHero } from "./drawHero";
import { heroLook } from "./look";
import { heroPose } from "./pose";

const FREE = new Set(["idle", "run", "jump", "fall"]);
const isFree = (): boolean => FREE.has(hero.state);
const isSwing = (): boolean => hero.state === "atk1" || hero.state === "atk2" || hero.state === "atk3";

function readActions(dir: number): void {
  const h = hero;
  const canAct = isFree() || h.state === "hang";
  if (take("dodge") && h.dodgeCd <= 0 && (canAct || isSwing() || h.state === "cast")) {
    if (h.state === "hang") leaveHang();
    if (dir) h.face = dir;
    setState("dodge");
    Object.assign(h, { dodgeCd: M.dodgeCooldown, vx: h.face * M.dodgeSpeed, vy: 0, ghostTimer: 0 });
    sfx.dodge();
  }
  if (take("attack")) {
    if (canAct) startAttack(1);
    else if (h.state === "atk1" || h.state === "atk2") h.queued = true;
  }
  if (take("warp") && h.mp >= COST.warp && (canAct || (isSwing() && h.hitDone))) startThrow();
  if (take("cast") && h.mp >= COST.cast && canAct) {
    if (h.state === "hang") leaveHang();
    h.mp -= COST.cast;
    setState("cast");
    sfx.cast();
  }
  if (take("jump")) jump();
}

function jump(): void {
  const h = hero;
  if (h.state === "hang") {
    leaveHang();
    h.vy = -M.hangJump;
    h.jumps = 1;
    setState("jump");
    return;
  }
  if (!isFree() && h.state !== "dodge") return;
  if (h.ground && isHeld("down") && h.y < GROUND) {
    h.drop = 0.22;
    h.ground = false;
  } else if (h.ground) {
    Object.assign(h, { vy: -M.jump, ground: false, jumps: 1, cutShort: false });
    setState("jump");
    dust(h.x, h.y, 4);
  } else if (h.jumps < 2) {
    Object.assign(h, { vy: -M.doubleJump, jumps: 2, cutShort: false });
    setState("jump");
    game.fx.push(createFloorRing(h.x, h.y, 14, PAL.crystal, 0.3, 0.3));
    for (let i = 0; i < 8; i++)
      particles.spawn(
        PK.FLAKE,
        h.x + rng.range(-6, 6),
        h.y,
        rng.range(-40, 40),
        rng.range(10, 50),
        rng.range(0.3, 0.6),
        { col: PAL.crystal[rng.int(4, 6)] },
      );
    sfx.doubleJump();
  }
}

function castSpell(): void {
  const h = hero;
  const element = ELEMENTS[game.spell];
  const c = ELEMENT_COLOR[element];
  const hx = h.x + h.face * h.hand[0];
  const hy = h.y + h.hand[1];
  if (h.st < CLIPS.cast.hit && rng.chance(0.6)) {
    const a = rng.range(0, TAU);
    const d = rng.range(14, 26);
    particles.spawn(
      PK.STREAK,
      hx + Math.cos(a) * d,
      hy + Math.sin(a) * d,
      -Math.cos(a) * 35,
      -Math.sin(a) * 35,
      rng.range(0.12, 0.18),
      { col: c },
    );
  }
  if (!h.hitDone && h.st >= CLIPS.cast.hit) {
    h.hitDone = true;
    lights.add(hx, hy, 30, c, 0.8, 0.2);
    game.fx.push(createGlint(hx, hy, c));
    game.fx.push(
      element === "fire"
        ? castFire(hx, hy, h.face)
        : element === "ice"
          ? castIce(h.x, h.y, h.face)
          : castBolt(h.x, h.y, h.face),
    );
  }
}

function runStateLogic(dt: number): void {
  const h = hero;
  const settle = () => setState(h.ground ? "idle" : "fall");
  switch (h.state) {
    case "atk1":
    case "atk2":
    case "atk3": {
      const clip = CLIPS[h.state];
      if (!h.hitDone && h.st >= clip.hit - 0.025) {
        h.hitDone = true;
        if (h.state === "atk1") crossCut();
        else if (h.state === "atk2") risingCut();
        else fallingSmash();
      }
      if (h.state === "atk3" && h.st > 0.1 && h.st < 0.17) h.vx = h.face * 150;
      if (h.queued && h.hitDone && h.st >= clip.hit + 0.09 && h.state !== "atk3") startAttack(h.combo === 1 ? 2 : 3);
      else if (h.st >= clip.dur) {
        h.combo = 0;
        settle();
      }
      break;
    }
    case "cast":
      castSpell();
      if (h.st >= CLIPS.cast.dur) settle();
      break;
    case "throw":
      if (h.st >= CLIPS.throw.hit) releaseSword();
      break;
    case "throwWait":
      h.sword?.update(dt);
      if (h.sword?.done && h.warpTarget) doWarp(h.warpTarget);
      break;
    case "warpStrike":
      if (h.st >= CLIPS.warpStrike.dur) settle();
      break;
    case "dodge":
      h.ghostTimer -= dt;
      if (h.ghostTimer <= 0) {
        h.ghostTimer = 0.045;
        drawHero(ghostCanvas, POSES.dodge, heroLook(4));
        game.ghosts.push({ s: ghostCanvas.snapshot(), x: h.x, y: h.y, flip: h.face < 0, life: 0.22, max: 0.22 });
        particles.spawn(
          PK.MOTE,
          h.x,
          h.y - rng.range(6, 26),
          -h.face * rng.range(20, 60),
          rng.range(-20, 20),
          rng.range(0.2, 0.4),
          {
            col: PAL.crystal[rng.int(3, 5)],
            size: 0.6,
          },
        );
      }
      if (h.st >= M.dodgeTime) {
        h.vx *= 0.4;
        settle();
      }
      break;
    case "hurt":
      if (h.st >= 0.32) settle();
      break;
    case "dead":
      if (h.st >= 2.4) resetRun();
      break;
    default:
  }
}

function move(dt: number, dir: number): void {
  const h = hero;
  const st = h.state;
  if (st === "hang") {
    h.vx = 0;
    h.vy = 0;
    if (take("down")) {
      leaveHang();
      setState("fall");
    }
    return;
  }
  const lunging = st === "atk3" && h.st > 0.1 && h.st < 0.17;
  if (isFree()) {
    h.vx = approach(h.vx, dir * M.runSpeed, (h.ground ? M.groundAccel : M.airAccel) * dt);
    if (dir) h.face = dir;
  } else if (st !== "dodge" && !lunging) h.vx = approach(h.vx, 0, (h.ground ? 800 : 300) * dt);
  // throwing, warping and casting hang in the air for a moment
  const floaty = st === "throwWait" || st === "throw" || st === "warpStrike" || st === "cast";
  const g = st === "dodge" ? 0 : floaty && !h.ground ? 0.25 : 1;
  h.vy = Math.min(M.maxFall, h.vy + M.gravity * g * dt);
  if (floaty && h.vy > 60) h.vy = 60;
  if (st === "dodge") h.vy = 0;
  h.x = clamp(h.x + h.vx * dt, 8, W - 8);
  const ny = h.y + h.vy * dt;
  let landed = false;
  if (h.vy >= 0) {
    if (ny >= GROUND) {
      h.y = GROUND;
      landed = true;
    } else if (h.drop <= 0)
      for (const p of PLATFORMS)
        if (h.x >= p.x0 - 3 && h.x <= p.x1 + 3 && h.y <= p.y + 0.01 && ny >= p.y) {
          h.y = p.y;
          landed = true;
          break;
        }
  }
  if (landed) {
    if (!h.ground && h.vy > 220) dust(h.x, h.y, 5);
    Object.assign(h, { vy: 0, ground: true, jumps: 0 });
    return;
  }
  h.y = ny;
  if (h.ground && (surfaceBelow(h.x, h.y) > h.y + 0.5 || h.drop > 0 || h.vy !== 0)) h.ground = false;
}

function animate(dt: number): void {
  const h = hero;
  if (isFree()) {
    const want = h.ground ? (Math.abs(h.vx) > 15 ? "run" : "idle") : h.vy < 0 ? "jump" : "fall";
    if (want !== h.state) setState(want);
  }
  if (h.state === "run") {
    const prev = h.runPhase;
    h.runPhase = (h.runPhase + dt * (Math.abs(h.vx) / M.runSpeed) * 1.9) % 1;
    if ((prev < 0.5 && h.runPhase >= 0.5) || h.runPhase < prev)
      particles.spawn(PK.DUST, h.x - h.face * 3, h.y - 1, -h.face * 15, -6, 0.35, {
        col: WORLD_COLORS.footDust,
        size: 1.6,
      });
  }
  if (h.state === "hang" && h.anchor) {
    h.x = h.anchor.x - h.face * 2;
    h.y = h.anchor.y + 38;
  }
  h.pose = heroPose(h, game.t);
  // the scarf hangs off the neck and the ponytail off the back of the head, blown back by a breeze and by speed
  const p = h.pose;
  const wind = -h.face * (22 + Math.sin(game.t * 3.1) * 18) - h.vx * 1.4;
  scarf.step(h.x + h.face * (p.nx - 2), h.y + p.ny + 0.5, dt, wind);
  ponytail.step(h.x + h.face * (p.nx - 4.5), h.y + p.ny - 6, dt, wind * 0.6);
}

export function updateHero(dt: number): void {
  const h = hero;
  const dir = (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);
  h.st += dt;
  h.inv = Math.max(0, h.inv - dt);
  h.dodgeCd = Math.max(0, h.dodgeCd - dt);
  h.drop = Math.max(0, h.drop - dt);
  if (h.state !== "dead")
    h.mp = Math.min(MAX_MP, h.mp + (h.state === "hang" ? MP_REGEN.hanging : MP_REGEN.normal) * dt);
  if (take("cycle")) {
    game.spell = (game.spell + 1) % ELEMENTS.length;
    sfx.pickup();
  }
  if (h.state !== "dead") readActions(dir);
  if (!isHeld("jump") && !isHeld("up") && h.vy < -120 && !h.cutShort && h.state === "jump") {
    h.vy *= 0.55;
    h.cutShort = true;
  }
  runStateLogic(dt);
  move(dt, dir);
  animate(dt);
}
