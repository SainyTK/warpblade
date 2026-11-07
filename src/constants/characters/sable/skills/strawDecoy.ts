import type { SkillDef } from "../../../../types/skill";

/** Straw Decoy: A cloaked decoy that lures foes to it, then bursts. Values: mp, cooldown: its cost and recharge; life: seconds it stands; lure: pixels it draws foes from; burst, radius: ability power and pixels of its burst; shoot: attack damage of a bolt it shoots every `every` seconds; stun: seconds a foe that reaches it is stunned; smoke: seconds its slowing smoke lasts; decoys: decoys per cast; snares: armed snares set around it. Design: docs/skills/sable.md */
export const STRAW_DECOY: SkillDef = {
  id: "s_decoy",
  name: "Straw Decoy",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "A cloaked decoy that lures foes to it, then bursts.",
  levels: [
    { text: "Set a decoy that lures foes, then bursts.", values: { mp: 30, cooldown: 6, life: 4, lure: 120, burst: 2, radius: 40, shoot: 0, every: 0.8, stun: 0, smoke: 0, decoys: 1, snares: 0 } },
    { text: "The decoy stands longer.", values: { mp: 30, cooldown: 6, life: 6, lure: 120, burst: 2, radius: 40, shoot: 0, every: 0.8, stun: 0, smoke: 0, decoys: 1, snares: 0 } },
    { text: "The decoy shoots back.", values: { mp: 30, cooldown: 6, life: 6, lure: 120, burst: 2, radius: 40, shoot: 0.6, every: 0.8, stun: 0, smoke: 0, decoys: 1, snares: 0 } },
    { text: "A bigger burst.", values: { mp: 30, cooldown: 6, life: 6, lure: 120, burst: 3.5, radius: 60, shoot: 0.6, every: 0.8, stun: 0, smoke: 0, decoys: 1, snares: 0 } },
    { text: "Foes that reach the decoy are stunned.", values: { mp: 30, cooldown: 6, life: 6, lure: 120, burst: 3.5, radius: 60, shoot: 0.6, every: 0.8, stun: 0.6, smoke: 0, decoys: 1, snares: 0 } },
    { text: "Cheaper.", values: { mp: 20, cooldown: 6, life: 6, lure: 120, burst: 3.5, radius: 60, shoot: 0.6, every: 0.8, stun: 0.6, smoke: 0, decoys: 1, snares: 0 } },
    { text: "The burst leaves slowing smoke.", values: { mp: 20, cooldown: 6, life: 6, lure: 120, burst: 3.5, radius: 60, shoot: 0.6, every: 0.8, stun: 0.6, smoke: 3, decoys: 1, snares: 0 } },
    { text: "Two decoys, and the burst hits harder.", values: { mp: 20, cooldown: 6, life: 6, lure: 120, burst: 6, radius: 60, shoot: 0.6, every: 0.8, stun: 0.6, smoke: 3, decoys: 2, snares: 0 } },
  ],
  evolution: {
    partner: "s_barbed",
    name: "Bait Pit",
    text: "Each decoy stands in a ring of four armed snares.",
    row: { text: "The decoy stands in a ring of snares.", values: { mp: 20, cooldown: 6, life: 6, lure: 120, burst: 6, radius: 60, shoot: 0.6, every: 0.8, stun: 0.6, smoke: 3, decoys: 2, snares: 4 } },
  },
};
