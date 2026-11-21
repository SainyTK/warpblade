import { LOCOMOTION_CLIPS } from "../../src/constants/clips/locomotion";
import { HERO_MOVE } from "../../src/constants/combat";
import { STRIDE } from "../../src/constants/motion";
import { KAEL_ACTION_CLIPS } from "../../src/heroes/kael/constants/clips";
import type { ActionClip } from "../../src/types/pose";
import { sampleKeys } from "../../src/utils/sampleKeys";
import type { Motion } from "./types";

function previous(clip: ActionClip, duration = clip.dur, speed = 0, lift = 0): Motion {
  return {
    duration,
    inPlace: true,
    sample(time) {
      const pose = sampleKeys(clip.keys, (Math.max(0, time) / duration) * clip.dur + 1e-8);
      return { pose, root: time * speed, lift, contacts: [false, false], beat: "" };
    },
  };
}

export const PREVIOUS = {
  Idle: previous(LOCOMOTION_CLIPS.idle),
  Walk: previous(LOCOMOTION_CLIPS.walk, STRIDE.walk / HERO_MOVE.walkSpeed, HERO_MOVE.walkSpeed),
  Crescent: previous(KAEL_ACTION_CLIPS.crescent),
  "Air spin": previous(KAEL_ACTION_CLIPS.spin, undefined, 0, 10),
};
