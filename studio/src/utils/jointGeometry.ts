import { BODY } from '@game/constants/hero';
import { armReach, legReach, toePoint } from '@game/rig';
import type { Pose } from '@game/types/pose';
import {
  atHip,
  chestBendToward,
  chestPoint,
  farShoulder,
  isElbowFlipped,
  isMirrored,
  nearShoulder,
} from '@game/utils/poseFrame';
import {
  ANGLE_SNAP,
  ELBOW_KEY,
  JOINT_SNAP,
  type JointHandle,
  type Side,
  TOE_KEY,
  TOE_RANGE,
} from '@/constants/joints';
import { ORIGIN_X, ORIGIN_Y } from '@/constants/stage';
import type { Point } from '@/types/studio';

const snap = (value: number, step: number): number => Math.round(value / step) * step;

/** An arm's shoulder and the hand it reaches for, as the game draws it. */
function arm(pose: Pose, side: Side): { shoulder: Point; hand: Point } {
  return side === 'near'
    ? { shoulder: nearShoulder(pose), hand: [pose.fx, pose.fy] }
    : { shoulder: farShoulder(pose), hand: [pose.bx, pose.by] };
}

/** Where an arm's elbow and hand end up, with the elbow bent the usual way or flipped. */
function armJoints(pose: Pose, side: Side, flipped: boolean): [Point, Point] {
  const { shoulder, hand } = arm(pose, side);
  return armReach(shoulder, hand, flipped);
}

const elbowFlipped = (pose: Pose, side: Side): boolean => isElbowFlipped(pose[ELBOW_KEY[side]]);

/** A leg's ankle as drawn: the leg cannot stretch past its length, so the ankle may stop short of the foot. */
function ankle(pose: Pose, side: Side): Point {
  const hip = atHip(pose, side === 'near' ? 1.5 : -1.5, 0);
  const foot: Point = side === 'near' ? [pose.ffx, pose.ffy] : [pose.bfx, pose.bfy];
  return legReach(hip, foot)[1];
}

/** The sword hand as drawn: the arm cannot stretch past its length, so the hand may stop short of fx, fy. */
const swordHand = (pose: Pose): Point => armJoints(pose, 'near', elbowFlipped(pose, 'near'))[1];

/** Local (unmirrored) pose point to stage art pixels. */
function toStage(pose: Pose, [x, y]: Point): Point {
  return [ORIGIN_X + (isMirrored(pose) ? -x : x), ORIGIN_Y + y];
}

/** Stage art pixels to a local (unmirrored) pose point. */
function toLocal(pose: Pose, [x, y]: Point): Point {
  const lx = x - ORIGIN_X;
  return [isMirrored(pose) ? -lx : lx, y - ORIGIN_Y];
}

/** Where a handle sits, in local pose pixels. */
function localPoint(handle: JointHandle, pose: Pose): Point {
  switch (handle.kind) {
    case 'joint':
      return [pose[handle.x], pose[handle.y]];
    case 'sword': {
      const [hx, hy] = swordHand(pose);
      return [hx + Math.cos(pose.sa) * BODY.bladeLength, hy + Math.sin(pose.sa) * BODY.bladeLength];
    }
    case 'chest':
      return chestPoint(pose);
    case 'elbow':
      return armJoints(pose, handle.side, elbowFlipped(pose, handle.side))[0];
    case 'toe':
      return toePoint(ankle(pose, handle.side), pose[TOE_KEY[handle.side]]);
  }
}

/** Where a handle sits on the stage, in art pixels. */
export function handlePoint(handle: JointHandle, pose: Pose): Point {
  return toStage(pose, localPoint(handle, pose));
}

/** The hip moved to x, y with the whole upper body (neck and both hands) carried along. */
function carryHip(pose: Pose, x: number, y: number): Pose {
  const dx = x - pose.hx;
  const dy = y - pose.hy;
  return {
    ...pose,
    hx: x,
    hy: y,
    nx: pose.nx + dx,
    ny: pose.ny + dy,
    fx: pose.fx + dx,
    fy: pose.fy + dy,
    bx: pose.bx + dx,
    by: pose.by + dy,
  };
}

/**
 * The pose after dragging a handle to a stage point. With `carry`, dragging the hip moves the whole upper body
 * with it, so a crouch or a lean keeps the arms in place on the body.
 */
export function dragHandle(handle: JointHandle, pose: Pose, to: Point, carry: boolean): Pose {
  const [lx, ly] = toLocal(pose, to);
  switch (handle.kind) {
    case 'sword': {
      const [hx, hy] = swordHand(pose);
      return { ...pose, sa: snap(Math.atan2(ly - hy, lx - hx), ANGLE_SNAP) };
    }
    case 'chest':
      return { ...pose, cb: snap(chestBendToward(pose, lx, ly), JOINT_SNAP) };
    case 'elbow': {
      const usual = armJoints(pose, handle.side, false)[0];
      const flipped = armJoints(pose, handle.side, true)[0];
      const flip =
        Math.hypot(flipped[0] - lx, flipped[1] - ly) < Math.hypot(usual[0] - lx, usual[1] - ly);
      return { ...pose, [ELBOW_KEY[handle.side]]: flip ? 1 : 0 };
    }
    case 'toe': {
      const [ax, ay] = ankle(pose, handle.side);
      const angle = Math.atan2(ly - (ay + 0.4), lx - ax);
      const tilt = snap(Math.min(TOE_RANGE, Math.max(-TOE_RANGE, angle)), ANGLE_SNAP);
      return { ...pose, [TOE_KEY[handle.side]]: tilt };
    }
    case 'joint': {
      const x = snap(lx, JOINT_SNAP);
      const y = snap(ly, JOINT_SNAP);
      if (carry && handle.id === 'hip') {
        return carryHip(pose, x, y);
      }
      return { ...pose, [handle.x]: x, [handle.y]: y };
    }
  }
}
