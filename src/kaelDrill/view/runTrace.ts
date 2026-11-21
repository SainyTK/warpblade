import type { Vec } from "../../types/rig";
import { lerp } from "../../utils/math";

export type LegTrace = { points: [Vec, Vec, Vec, Vec]; inferred: number };
export type TraceFrame = { source: number; near: LegTrace; far: LegTrace };
type LegAngles = { thigh: number; shin: number; boot: number };

export const RUN_TRACE: readonly TraceFrame[] = [
  {
    source: 96,
    near: {
      points: [
        [173, 88],
        [168, 118],
        [156, 133],
        [160, 136],
      ],
      inferred: 1,
    },
    far: {
      points: [
        [178, 90],
        [191, 114],
        [182, 117],
        [173, 122],
      ],
      inferred: 3,
    },
  },
  {
    source: 98,
    near: {
      points: [
        [173, 88],
        [159, 118],
        [148, 132],
        [146, 137],
      ],
      inferred: 1,
    },
    far: {
      points: [
        [178, 90],
        [193, 108],
        [186, 114],
        [177, 119],
      ],
      inferred: 3,
    },
  },
  {
    source: 100,
    near: {
      points: [
        [165, 89],
        [149, 118],
        [128, 132],
        [123, 138],
      ],
      inferred: 1,
    },
    far: {
      points: [
        [172, 90],
        [197, 105],
        [184, 127],
        [194, 136],
      ],
      inferred: 1,
    },
  },
  {
    source: 102,
    near: {
      points: [
        [166, 90],
        [145, 113],
        [133, 126],
        [127, 130],
      ],
      inferred: 7,
    },
    far: {
      points: [
        [173, 89],
        [198, 108],
        [194, 129],
        [201, 132],
      ],
      inferred: 1,
    },
  },
  {
    source: 104,
    near: {
      points: [
        [164, 90],
        [142, 113],
        [121, 121],
        [111, 127],
      ],
      inferred: 7,
    },
    far: {
      points: [
        [171, 90],
        [195, 107],
        [189, 130],
        [198, 133],
      ],
      inferred: 1,
    },
  },
  {
    source: 106,
    near: {
      points: [
        [157, 94],
        [134, 119],
        [112, 115],
        [106, 122],
      ],
      inferred: 3,
    },
    far: {
      points: [
        [165, 94],
        [183, 116],
        [186, 132],
        [193, 136],
      ],
      inferred: 1,
    },
  },
  {
    source: 108,
    near: {
      points: [
        [156, 94],
        [135, 118],
        [113, 110],
        [106, 117],
      ],
      inferred: 3,
    },
    far: {
      points: [
        [161, 95],
        [179, 116],
        [176, 130],
        [181, 133],
      ],
      inferred: 1,
    },
  },
  {
    source: 110,
    near: {
      points: [
        [155, 95],
        [141, 120],
        [124, 114],
        [117, 120],
      ],
      inferred: 3,
    },
    far: {
      points: [
        [161, 95],
        [170, 116],
        [169, 132],
        [176, 135],
      ],
      inferred: 1,
    },
  },
  {
    source: 112,
    near: {
      points: [
        [152, 96],
        [161, 119],
        [137, 118],
        [128, 123],
      ],
      inferred: 3,
    },
    far: {
      points: [
        [157, 96],
        [156, 123],
        [153, 132],
        [160, 136],
      ],
      inferred: 3,
    },
  },
  {
    source: 114,
    near: {
      points: [
        [150, 96],
        [166, 115],
        [147, 122],
        [135, 124],
      ],
      inferred: 3,
    },
    far: {
      points: [
        [154, 95],
        [150, 118],
        [142, 132],
        [144, 138],
      ],
      inferred: 3,
    },
  },
  {
    source: 116,
    near: {
      points: [
        [151, 95],
        [164, 113],
        [152, 121],
        [140, 125],
      ],
      inferred: 3,
    },
    far: {
      points: [
        [154, 95],
        [143, 121],
        [135, 132],
        [136, 138],
      ],
      inferred: 3,
    },
  },
  {
    source: 118,
    near: {
      points: [
        [159, 91],
        [178, 106],
        [153, 120],
        [141, 124],
      ],
      inferred: 3,
    },
    far: {
      points: [
        [155, 93],
        [140, 116],
        [126, 131],
        [121, 138],
      ],
      inferred: 1,
    },
  },
  {
    source: 120,
    near: {
      points: [
        [149, 86],
        [176, 99],
        [160, 126],
        [169, 131],
      ],
      inferred: 1,
    },
    far: {
      points: [
        [141, 89],
        [127, 111],
        [108, 133],
        [101, 137],
      ],
      inferred: 1,
    },
  },
  {
    source: 122,
    near: {
      points: [
        [155, 89],
        [178, 108],
        [175, 130],
        [180, 135],
      ],
      inferred: 1,
    },
    far: {
      points: [
        [147, 90],
        [130, 118],
        [105, 128],
        [98, 135],
      ],
      inferred: 1,
    },
  },
];

export const cyclePhase = (phase: number): number => phase - Math.floor(phase);

export function referenceRunPhase(source: number): number {
  if (source <= 102) {
    return lerp(0.2, 0.5, (source - 96) / 6);
  }
  if (source <= 120) {
    return lerp(0.5, 1, (source - 102) / 18);
  }
  return lerp(1, 1.2, (source - 120) / 4);
}

const angle = (from: Vec, to: Vec): number => Math.atan2(to[1] - from[1], to[0] - from[0]);

function legAngles({ points: [hip, knee, ankle, toe] }: LegTrace): LegAngles {
  return { thigh: angle(hip, knee), shin: angle(knee, ankle), boot: angle(ankle, toe) };
}

export const REFERENCE_FLOOR_Y = 131;

const keys = RUN_TRACE.map(({ source, near, far }) => ({
  phase: cyclePhase(referenceRunPhase(source)),
  hipY: (near.points[0][1] + far.points[0][1]) * 0.5,
  near: legAngles(near),
  far: legAngles(far),
})).sort((first, second) => first.phase - second.phase);

function angleMix(from: number, to: number, t: number): number {
  const delta = to - from;
  return from + Math.atan2(Math.sin(delta), Math.cos(delta)) * t;
}

function mixLeg(from: LegAngles, to: LegAngles, t: number): LegAngles {
  return {
    thigh: angleMix(from.thigh, to.thigh, t),
    shin: angleMix(from.shin, to.shin, t),
    boot: angleMix(from.boot, to.boot, t),
  };
}

export function sampleRunTrace(phase: number): { legs: readonly [LegAngles, LegAngles]; hipY: number } {
  const u = cyclePhase(phase);
  const upper = keys.findIndex((key) => key.phase > u);
  const lo = upper < 0 ? keys[keys.length - 1] : keys[upper - 1];
  const hi = upper < 0 ? keys[0] : keys[upper];
  const t = (u - lo.phase) / (hi.phase + (upper < 0 ? 1 : 0) - lo.phase);
  return { legs: [mixLeg(lo.near, hi.near, t), mixLeg(lo.far, hi.far, t)], hipY: lerp(lo.hipY, hi.hipY, t) };
}
