import { AC } from "./colors";
import { fang, type Pt } from "./paint";
import { joint, LIMB, SHOULDER, type SovereignBody } from "./sovereignBody";
import { ARMOUR } from "./sovereignColors";

/** where the far hand hangs when it is off the grip, its talons curled */
const REAR_HANG: Pt = [-11.5, -19];
/** the grip runs this far back from the front hand to where the far hand closes on it */
const HAND_GAP = 2.4;
/** arm radii: upper arm at the shoulder and elbow, forearm at the elbow and wrist, the elbow cop and the fist */
const ARM = { shoulder: 2.7, elbow: 2.2, fore: 2.4, wrist: 1.7, cop: 1.7, fist: 1.9 } as const;

/** where each hand is now: the near one on the grip, the far one on the grip behind it or hanging at its side */
export function hands(b: SovereignBody): { front: Pt; rear: Pt } {
  const { pose } = b;
  const front = b.sunk(pose.grip);
  const onGrip: Pt = [front[0] - Math.cos(pose.angle) * HAND_GAP, front[1] - Math.sin(pose.angle) * HAND_GAP];
  const sway = Math.sin(b.time * 2.2) * 0.8;
  const hang = b.at(REAR_HANG[0], REAR_HANG[1] + sway);
  return {
    front,
    rear: [hang[0] + (onGrip[0] - hang[0]) * pose.both, hang[1] + (onGrip[1] - hang[1]) * pose.both],
  };
}

/** one arm from its shoulder to its hand: a plated upper arm, a cop at the elbow and a flared vambrace */
export function drawArm(b: SovereignBody, near: boolean): void {
  const { g } = b;
  const shoulder = b.at(...(near ? SHOULDER.front : SHOULDER.rear));
  const hand = near ? hands(b).front : hands(b).rear;
  const elbow = joint(shoulder, hand, LIMB.upper, LIMB.fore, 1);
  const base = near ? ARMOUR.base : ARMOUR.dark;
  const light = near ? ARMOUR.sheen : ARMOUR.light;
  const dark = near ? ARMOUR.dark : ARMOUR.deep;
  b.g.s.begin();
  g.taper(...shoulder, ...elbow, ARM.shoulder, ARM.elbow, base);
  g.taper(...elbow, ...hand, ARM.fore, ARM.wrist, base);
  b.g.s.shadeEdges(base, light, dark, 2);
  b.g.s.commit();
  b.g.s.begin();
  g.dot(...elbow, ARM.cop, base);
  b.g.s.shadeEdges(base, light, dark);
  b.g.s.commit();
  drawFist(b, near);
}

/** a gauntleted fist on the grip, or the far hand's curled talons when it hangs free */
export function drawFist(b: SovereignBody, near: boolean): void {
  const { g, pose } = b;
  const hand = near ? hands(b).front : hands(b).rear;
  const base = near ? ARMOUR.base : ARMOUR.dark;
  b.g.s.begin();
  g.dot(...hand, ARM.fist, base);
  b.g.s.shadeEdges(base, near ? ARMOUR.sheen : ARMOUR.light, ARMOUR.deep);
  // knuckle plates, a glint on the near fist
  g.set(hand[0] + b.lit * 0.5, hand[1] - 1, ARMOUR.glint);
  b.g.s.commit();
  if (near || pose.both > 0.5) return;
  // the free hand's talons curl toward the floor
  b.g.s.begin();
  for (let j = 0; j < 3; j++) {
    const [x, y] = [hand[0] - 0.5 + j * 1.1, hand[1] + 1.2];
    const tip: Pt = [x + 0.8, y + 2.4];
    fang(g.s, [g.x(x), y], [g.x(tip[0]), tip[1]], 0.9, AC.clawDeep);
  }
  b.g.s.shadeEdges(AC.clawDeep, AC.clawDark, ARMOUR.deep);
  b.g.s.commit();
}
