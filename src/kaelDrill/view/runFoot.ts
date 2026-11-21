import { BODY } from "../../constants/hero";
import { toePoint } from "../../rig";
import type { Pose } from "../../types/pose";
import type { Vec } from "../../types/rig";
import { clamp, lerp, smooth } from "../../utils/math";
import { atHip } from "../../utils/poseFrame";
import { cyclePhase, REFERENCE_FLOOR_Y, sampleRunTrace } from "./runTrace";

export const RUN_STRIDE = 38;
export const RUN_TOE_OFF = 0.46;

const HALF_CYCLE = 0.5;
const HIP_OFFSETS = [1.5, -1.5] as const;
const HIP_SAMPLES = 96;
const HIP_FILTER = [1, 2, 3, 4, 3, 2, 1] as const;
const FILTER_OFFSET = Math.floor(HIP_FILTER.length / 2);
const FILTER_WEIGHT = HIP_FILTER.reduce((sum, weight) => sum + weight, 0);
const LEG_REACH = BODY.thigh + BODY.shin - 0.08;
const CONTACT_POSE_WEIGHT = 0.72;

type Side = 0 | 1;
type Foot = { ankle: Vec; tilt: number };
type Feet = readonly [Foot, Foot];
type UpperBody = (phase: number) => Pose;

function projectFeet(pose: Pose, phase: number): Feet {
  const { legs } = sampleRunTrace(phase);
  const project = (side: Side): Foot => {
    const { thigh, shin, boot } = legs[side];
    const [x, y] = atHip(pose, HIP_OFFSETS[side], 0);
    return {
      ankle: [
        x + BODY.thigh * Math.cos(thigh) + BODY.shin * Math.cos(shin),
        y + BODY.thigh * Math.sin(thigh) + BODY.shin * Math.sin(shin),
      ],
      tilt: boot,
    };
  };
  return [project(0), project(1)];
}

function contactY(tilt: number): number {
  return -1 - Math.max(0, toePoint([0, -1], tilt)[1]);
}

function translate(pose: Pose, [x, y]: Vec): Pose {
  return {
    ...pose,
    hx: pose.hx + x,
    hy: pose.hy + y,
    nx: pose.nx + x,
    ny: pose.ny + y,
    fx: pose.fx + x,
    fy: pose.fy + y,
    bx: pose.bx + x,
    by: pose.by + y,
  };
}

function pelvisScale(upperBody: UpperBody, contacts: Feet): number {
  const kaelHeight = [0, 1].reduce((sum, i) => {
    const base = upperBody(i * HALF_CYCLE);
    const foot = contacts[i];
    return sum - (base.hy + contactY(foot.tilt) - foot.ankle[1]);
  }, 0);
  const referenceHeight = [0, HALF_CYCLE].reduce((sum, u) => sum + REFERENCE_FLOOR_Y - sampleRunTrace(u).hipY, 0);
  return kaelHeight / referenceHeight;
}

export function fitRunFeet(upperBody: UpperBody): UpperBody {
  const contacts = [projectFeet(upperBody(0), 0)[0], projectFeet(upperBody(HALF_CYCLE), HALF_CYCLE)[1]] as const;
  const scale = pelvisScale(upperBody, contacts);
  const supportOf = (phase: number): Side => (phase < HALF_CYCLE ? 0 : 1);
  const planted = (foot: Foot, side: Side, age: number): Vec => [
    contacts[side].ankle[0] - age * RUN_STRIDE,
    contactY(foot.tilt),
  ];
  const heightShift = (base: Pose, foot: Foot, phase: number): number => {
    const tracedHeight = (sampleRunTrace(phase).hipY - REFERENCE_FLOOR_Y) * scale - base.hy;
    const contactHeight = contactY(foot.tilt) - foot.ankle[1];
    return lerp(tracedHeight, contactHeight, CONTACT_POSE_WEIGHT);
  };
  const landingHeights = [
    heightShift(upperBody(0), contacts[0], 0),
    heightShift(upperBody(HALF_CYCLE), contacts[1], HALF_CYCLE),
  ] as const;
  const directHipX = (phase: number, side: Side, age: number): number => {
    const foot = projectFeet(upperBody(phase), phase)[side];
    return planted(foot, side, age)[0] - foot.ankle[0];
  };
  const rawHip = Array.from({ length: HIP_SAMPLES }, (_, i) => {
    const u = i / HIP_SAMPLES;
    const side = supportOf(u);
    const age = u % HALF_CYCLE;
    const end = side * HALF_CYCLE + RUN_TOE_OFF;
    return age <= RUN_TOE_OFF
      ? directHipX(u, side, age)
      : lerp(directHipX(end, side, RUN_TOE_OFF), 0, smooth(RUN_TOE_OFF, HALF_CYCLE, age));
  });
  const filteredHip = rawHip.map(
    (_, i) =>
      HIP_FILTER.reduce((sum, weight, j) => {
        const sample = (i + j - FILTER_OFFSET + HIP_SAMPLES) % HIP_SAMPLES;
        return sum + rawHip[sample] * weight;
      }, 0) / FILTER_WEIGHT,
  );
  const fitStance = (base: Pose, foot: Foot, phase: number, side: Side, age: number, y: number): number => {
    const sample = phase * HIP_SAMPLES;
    const index = Math.floor(sample);
    const filtered = lerp(filteredHip[index], filteredHip[(index + 1) % HIP_SAMPLES], sample - index);
    const [x, floor] = planted(foot, side, age);
    const [hipX, hipY] = atHip(base, HIP_OFFSETS[side], 0);
    const height = floor - hipY - y;
    const reach = Math.sqrt(Math.max(0, LEG_REACH ** 2 - height ** 2));
    const shift = lerp(x - foot.ankle[0], filtered, smooth(0, 0.12, age));
    return clamp(shift, x - hipX - reach, x - hipX + reach);
  };
  const releaseFor = (side: Side) => {
    const phase = side * HALF_CYCLE + RUN_TOE_OFF;
    const base = upperBody(phase);
    const foot = projectFeet(base, phase)[side];
    const y = heightShift(base, foot, phase);
    const x = fitStance(base, foot, phase, side, RUN_TOE_OFF, y);
    const pin = planted(foot, side, RUN_TOE_OFF);
    return {
      x,
      y,
      carry: [pin[0] - foot.ankle[0] - x, pin[1] - foot.ankle[1] - y] as Vec,
    };
  };
  const releases = [releaseFor(0), releaseFor(1)] as const;

  return (phase: number): Pose => {
    const u = cyclePhase(phase);
    const support = supportOf(u);
    const age = u % HALF_CYCLE;
    const base = upperBody(u);
    const feet = projectFeet(base, u);
    const grounded = age <= RUN_TOE_OFF;
    const travel = smooth(RUN_TOE_OFF, HALF_CYCLE, age);
    const release = releases[support];
    const next: Side = support === 0 ? 1 : 0;
    const y = grounded ? heightShift(base, feet[support], u) : lerp(release.y, landingHeights[next], travel);
    const x = grounded ? fitStance(base, feet[support], u, support, age, y) : lerp(release.x, 0, travel);
    const tuck = smooth(0, 0.2, u) * (1 - smooth(0.2, RUN_TOE_OFF, u));
    const body = translate(base, [x, lerp(y, Math.max(0, y), tuck)]);
    const target = (side: Side): Vec => {
      const foot = feet[side];
      if (grounded && side === support) {
        return planted(foot, side, age);
      }
      const footAge = cyclePhase(u - HALF_CYCLE * side);
      const blend = 1 - smooth(RUN_TOE_OFF, 0.63, footAge);
      const [dx, dy] = releases[side].carry;
      const recovery = side === 1 ? tuck : 0;
      const ankleX = foot.ankle[0] + x + dx * blend + BODY.shin * 0.55 * recovery;
      const ankleY = foot.ankle[1] + y + dy * blend - BODY.shin * 0.3 * recovery;
      return [ankleX, ankleY - Math.max(0, toePoint([ankleX, ankleY], foot.tilt)[1])];
    };
    const [ffx, frontAnkleY] = target(0);
    const [bfx, backAnkleY] = target(1);
    return {
      ...body,
      ffx,
      ffy: frontAnkleY + 1,
      fa: feet[0].tilt,
      bfx,
      bfy: backAnkleY + 1,
      ba: feet[1].tilt,
    };
  };
}
