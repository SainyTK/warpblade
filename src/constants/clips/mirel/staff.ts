import type { StaffBlow } from "../../../types/mirel";
import type { ActionClip, Pose } from "../../../types/pose";
import { frame } from "../../hero";
import { STAFF_BLOWS } from "../../mirel/string";
import { HANG_LEGS, m, onShaft, STANCE } from "./stance";

/** her feet through the string: the front foot a step ahead, the back foot set behind, both planted */
const SET = { ffx: 6, bfx: -4 } as const;

/** a pose of the string: the stance with her feet set and the far hand on the shaft `d` pixels from the near hand */
const g = (p: Partial<Pose> & { fx: number; fy: number; sa: number }, d: number): Pose =>
  m({ ...SET, be: 0, ...onShaft(p.fx, p.fy, p.sa, d), ...p });

/** where Tick hands over: feet set, the staff tipped forward, ready for the next blow or the walk back to the stance */
const TICK_END = g({ hx: 0.5, hy: -13.8, nx: 1.5, ny: -23.8, cb: 0.2, fx: 7, fy: -16.5, sa: -1.1 }, -6);

/** where Tock hands over: tall, the staff come over the top and resting on her near shoulder, which Toll lifts from */
const TOCK_END = g({ hx: 0, hy: -14.3, ny: -24.6, nx: 0, cb: -0.5, fx: 2.5, fy: -23, sa: -2.45 }, -5);

/** Tick's wind-up: the front foot lifted on its way out to the set */
const STEP_OUT = { ffx: 4.5, ffy: -1.5, fa: 0.35, bfx: -3 } as const;
/** Tick's strike: the back heel lifted off the push */
const PUSH_OFF = { ba: 0.5, bfy: -0.5 } as const;
/** Tock's strike: up on the toes of the back foot */
const ON_TOES = { ba: 0.55, bfy: -1 } as const;

/** Toll's wind-up: the front knee drawn up off the floor for the stamp */
const LIFTED = { ffx: 5, ffy: -3, fa: 0.4 } as const;
/** Toll's plant: the front foot stamped down a step further on, the back leg stretched behind on its toes */
const PLANT = { ffx: 8, bfx: -5, ba: 0.5 } as const;
/** after Toll: the front foot lifted on its way back home under her */
const STEP_BACK = { ffx: 5.5, ffy: -1.5, fa: 0.3, bfx: -3 } as const;

/** in the air: legs together, toes pointed */
const air = (p: Partial<Pose>): Pose => m({ ...HANG_LEGS, ...p });
/** Pendant Strike's wind-up: the knees tucked up under her */
const TUCK = { ffx: 3, ffy: -4, fa: 0.4 } as const;
/** Pendant Strike's strike: the legs kicked back behind the downward swing */
const KICK = { be: 0, ffx: -0.5, ffy: -2.5, bfx: -3.5, bfy: -4 } as const;

/**
 * Her staff string. Each blow loads against itself and holds it, snaps to a new silhouette on its hit frame, holds the
 * strike through the hit-stop with a small overshoot, carries through, and settles where the next blow starts: Tick is
 * low and long, leaning flat along a level jab; Tock rises from a crouch onto her toes with the staff swept over her
 * head; Toll lifts it in both hands on one leg and stamps it down into the floor ahead, the body dropped low and wide.
 */
export const STAFF_CLIPS: Record<StaffBlow, ActionClip> = {
  /** the hips sink and the staff draws back level at the hip as the front foot steps out, held two frames; the snap
   *  throws the body flat along the jab, the back heel lifts off the push, and the staff draws back up to guard */
  tick: {
    dur: STAFF_BLOWS.tick.dur,
    hit: STAFF_BLOWS.tick.hit,
    keys: [
      [0, STANCE],
      [frame(2), g({ hx: -1, hy: -13.5, nx: -1.5, ny: -23.6, cb: -0.5, fx: 1, fy: -15, sa: 0.05, ...STEP_OUT }, -6)],
      [frame(4), g({ hx: -1.5, hy: -13, nx: -2.5, ny: -23, cb: -0.8, fx: -1, fy: -14.5, sa: 0.08, ba: 0.15 }, -6)],
      [frame(5), g({ hx: 2, hy: -12.5, nx: 5, ny: -22.5, cb: 1, fx: 12, fy: -15, sa: 0, ...PUSH_OFF }, -7), "snap"],
      [frame(7), g({ hx: 2.3, hy: -12.4, nx: 5.6, ny: -22.4, cb: 1.1, fx: 13, fy: -15, sa: 0.02, ...PUSH_OFF }, -7)],
      [frame(9), g({ hx: 1.5, hy: -12.8, nx: 4, ny: -22.8, cb: 0.8, fx: 10.5, fy: -15.5, sa: -0.25, ba: 0.3 }, -6.5)],
      [frame(11), g({ hx: 0.8, hy: -13.5, nx: 2.2, ny: -23.5, cb: 0.4, fx: 8, fy: -16.3, sa: -0.85, ba: 0.1 }, -6)],
      [frame(12), TICK_END],
    ],
  },
  /** the knees drop and the staff swings low ahead, its ring near the floor, held two frames; the snap stands her up
   *  on her toes with the back arched and the staff thrown up over her head, and it carries on over to her shoulder */
  tock: {
    dur: STAFF_BLOWS.tock.dur,
    hit: STAFF_BLOWS.tock.hit,
    keys: [
      [0, TICK_END],
      [frame(2), g({ hx: 0.5, hy: -12.5, nx: 2, ny: -22.5, cb: 0.5, fx: 9, fy: -10, sa: 0.5, ba: 0.15 }, -6)],
      [frame(4), g({ hx: 1, hy: -11.5, nx: 2.8, ny: -21.5, cb: 0.9, fx: 9.5, fy: -8.5, sa: 0.65, ba: 0.3 }, -6)],
      [frame(5), g({ hx: 0, hy: -15, nx: 0, ny: -25.5, cb: -1, fx: 4, fy: -28, sa: -1.75, ...ON_TOES }, -5), "snap"],
      [frame(7), g({ hx: -0.3, hy: -15.2, nx: -0.6, ny: -25.8, cb: -1.2, fx: 3.5, fy: -28.5, sa: -2, ...ON_TOES }, -5)],
      [frame(9), g({ hx: -0.1, hy: -14.6, nx: -0.3, ny: -24.9, cb: -0.7, fx: 2.5, fy: -24.5, sa: -2.4, ba: 0.2 }, -5)],
      [frame(10), TOCK_END],
    ],
  },
  /** she rises onto her back foot with the staff high in both hands and the front knee drawn up, held three frames;
   *  the snap stamps the foot and drives the staff's foot into the floor ahead, the body dropped low over it; she
   *  holds the plant while the ring rings, draws the staff up out of the floor and steps back into the stance */
  toll: {
    dur: STAFF_BLOWS.toll.dur,
    hit: STAFF_BLOWS.toll.hit,
    keys: [
      [0, TOCK_END],
      [frame(2), g({ hy: -15, nx: -1, ny: -25.5, cb: -0.8, fx: 4.5, fy: -29, sa: -1.62, ba: 0.3 }, -4)],
      [frame(4), g({ hy: -15.5, nx: -1.5, ny: -26, cb: -1.2, fx: 5, fy: -30.5, sa: -1.7, ...LIFTED, ba: 0.3 }, -4)],
      [
        frame(6),
        g({ hy: -15.6, nx: -2, ny: -26.1, cb: -1.3, fx: 4.8, fy: -31, sa: -1.72, ...LIFTED, ffy: -3.5, ba: 0.3 }, -4),
      ],
      [frame(7), g({ ...PLANT, hx: 2.5, hy: -10.5, nx: 6, ny: -20.5, cb: 1.4, fx: 14, fy: -12, sa: -1.1 }, 5), "snap"],
      [frame(9), g({ ...PLANT, hx: 2.7, hy: -10.2, nx: 6.4, ny: -20.2, cb: 1.5, fx: 14.4, fy: -11.7, sa: -1.08 }, 5)],
      [frame(11), g({ ...PLANT, hx: 2.5, hy: -10.5, nx: 6, ny: -20.5, cb: 1.4, fx: 14.2, fy: -11.9, sa: -1.1 }, 5)],
      [
        frame(13),
        g({ ...PLANT, hx: 1.6, hy: -12.2, nx: 4, ny: -22.2, cb: 0.7, fx: 11.5, fy: -14.5, sa: -1.3, ba: 0.3 }, 4),
      ],
      [
        frame(15),
        m({ hx: 0.6, hy: -13.6, nx: 1.8, ny: -23.6, cb: 0.2, fx: 8, fy: -16.2, bx: 5, by: -13.5, ...STEP_BACK }),
      ],
      [frame(17), m({ hx: 0.2, nx: 0.8, ny: -23.9, fx: 6.5, fy: -16, bx: 4.3, by: -13.2, ffx: 3.5, bfx: -2.3 })],
      [frame(18), STANCE],
    ],
  },
  /** in the air: knees tucked and the staff raised behind her head, held two frames; the snap curls her forward over
   *  a downward arc with the legs kicked back, and she uncurls with the staff carried level */
  pendant: {
    dur: STAFF_BLOWS.pendant.dur,
    hit: STAFF_BLOWS.pendant.hit,
    keys: [
      [0, air({ fx: 6, fy: -22, sa: -1.2, bx: 3, by: -19 })],
      [frame(2), air({ nx: -0.5, cb: -0.6, fx: 3, fy: -28, sa: -1.9, bx: 1, by: -24, be: 1, ...TUCK })],
      [frame(4), air({ nx: -1.2, cb: -1, fx: 1.5, fy: -29.5, sa: -2.15, bx: 0, by: -25, be: 1, ...TUCK, ffy: -4.5 })],
      [
        frame(5),
        air({ ...KICK, hx: -0.5, nx: 3.5, cb: 1.4, ...onShaft(10, -15, 0.95, -6), fx: 10, fy: -15, sa: 0.95 }),
        "snap",
      ],
      [
        frame(7),
        air({ ...KICK, hx: -0.6, nx: 3.8, cb: 1.5, ...onShaft(10, -14, 1.15, -6), fx: 10, fy: -14, sa: 1.15 }),
      ],
      [
        frame(9),
        air({ nx: 2, cb: 0.7, ...onShaft(9, -16, 0.55, -6), fx: 9, fy: -16, sa: 0.55, be: 0, ffx: 0.5, bfx: -2 }),
      ],
      [frame(12), air({ fx: 7, fy: -18, sa: -0.15, bx: 3, by: -18 })],
    ],
  },
};
