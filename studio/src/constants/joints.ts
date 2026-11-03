import type { PoseKey } from '@game/types/pose';

/** The near limbs (sword arm, front leg) or the far ones. */
export type Side = 'near' | 'far';

interface HandleBase {
  id: string;
  label: string;
  /** Far-side limbs are drawn dimmer, as the game shades them. */
  far: boolean;
  color: string;
  /** Bend handles (chest, elbows, toes) are drawn smaller than the joints they hang off. */
  minor: boolean;
}

/**
 * A draggable point of the rig: a joint with its pose keys, the sword tip, the feet (root travel), the chest (spine
 * bend), an elbow (dragged across the arm to flip its bend) or a toe (the foot angle).
 */
export type JointHandle = HandleBase &
  (
    | { kind: 'root' }
    | { kind: 'joint'; x: PoseKey; y: PoseKey }
    | { kind: 'sword' }
    | { kind: 'chest' }
    | { kind: 'elbow'; side: Side }
    | { kind: 'toe'; side: Side }
  );

const NEAR = '#3fc06a';
const FAR = '#b673e8';
const BODY = '#e6e4f0';

/** Drawn back to front, so near handles sit on top. */
export const JOINT_HANDLES: readonly JointHandle[] = [
  { id: 'root', label: 'Feet', kind: 'root', far: false, minor: false, color: '#ffc23d' },
  {
    id: 'hip',
    label: 'Hip',
    kind: 'joint',
    x: 'hx',
    y: 'hy',
    far: false,
    minor: false,
    color: BODY,
  },
  { id: 'chest', label: 'Chest', kind: 'chest', far: false, minor: true, color: BODY },
  {
    id: 'neck',
    label: 'Neck',
    kind: 'joint',
    x: 'nx',
    y: 'ny',
    far: false,
    minor: false,
    color: BODY,
  },
  {
    id: 'farElbow',
    label: 'Far elbow',
    kind: 'elbow',
    side: 'far',
    far: true,
    minor: true,
    color: FAR,
  },
  {
    id: 'farHand',
    label: 'Far hand',
    kind: 'joint',
    x: 'bx',
    y: 'by',
    far: true,
    minor: false,
    color: FAR,
  },
  { id: 'farToe', label: 'Far toe', kind: 'toe', side: 'far', far: true, minor: true, color: FAR },
  {
    id: 'farFoot',
    label: 'Far foot',
    kind: 'joint',
    x: 'bfx',
    y: 'bfy',
    far: true,
    minor: false,
    color: FAR,
  },
  {
    id: 'nearToe',
    label: 'Near toe',
    kind: 'toe',
    side: 'near',
    far: false,
    minor: true,
    color: NEAR,
  },
  {
    id: 'nearFoot',
    label: 'Near foot',
    kind: 'joint',
    x: 'ffx',
    y: 'ffy',
    far: false,
    minor: false,
    color: NEAR,
  },
  {
    id: 'nearElbow',
    label: 'Sword elbow',
    kind: 'elbow',
    side: 'near',
    far: false,
    minor: true,
    color: NEAR,
  },
  {
    id: 'nearHand',
    label: 'Sword hand',
    kind: 'joint',
    x: 'fx',
    y: 'fy',
    far: false,
    minor: false,
    color: NEAR,
  },
  { id: 'sword', label: 'Sword tip', kind: 'sword', far: false, minor: false, color: '#5ec8ef' },
];

/** The rig's bones, drawn as faint lines between handles. */
export const RIG_BONES: readonly [string, string][] = [
  ['hip', 'chest'],
  ['chest', 'neck'],
  ['neck', 'nearElbow'],
  ['nearElbow', 'nearHand'],
  ['neck', 'farElbow'],
  ['farElbow', 'farHand'],
  ['hip', 'nearFoot'],
  ['nearFoot', 'nearToe'],
  ['hip', 'farFoot'],
  ['farFoot', 'farToe'],
  ['nearHand', 'sword'],
];

/** The pose key each side's elbow flip and foot angle is stored in. */
export const ELBOW_KEY: Record<Side, PoseKey> = { near: 'fe', far: 'be' };
export const TOE_KEY: Record<Side, PoseKey> = { near: 'fa', far: 'ba' };

/** How a pose field is shown and stepped: pixels or radians. */
export type FieldUnit = 'px' | 'rad';

/** Pose fields in the panel, grouped by body part. Single-key rows are bends and angles. */
export const JOINT_FIELDS: readonly { label: string; keys: readonly PoseKey[]; unit: FieldUnit }[] =
  [
    { label: 'Hip', keys: ['hx', 'hy'], unit: 'px' },
    { label: 'Chest bend', keys: ['cb'], unit: 'px' },
    { label: 'Neck', keys: ['nx', 'ny'], unit: 'px' },
    { label: 'Sword hand', keys: ['fx', 'fy'], unit: 'px' },
    { label: 'Far hand', keys: ['bx', 'by'], unit: 'px' },
    { label: 'Near foot', keys: ['ffx', 'ffy'], unit: 'px' },
    { label: 'Near toe', keys: ['fa'], unit: 'rad' },
    { label: 'Far foot', keys: ['bfx', 'bfy'], unit: 'px' },
    { label: 'Far toe', keys: ['ba'], unit: 'rad' },
    { label: 'Sword angle', keys: ['sa'], unit: 'rad' },
  ];

/** Dragged joints and the chest bend snap to half pixels; the sword and foot angles to this many radians. */
export const JOINT_SNAP = 0.5;
export const ANGLE_SNAP = 0.05;
/** A dragged toe tilts at most this many radians either way, from lifted onto the heel to pointed. */
export const TOE_RANGE = 1.3;
/** Pointer reach of a handle, in screen pixels. */
export const HANDLE_REACH = 12;
