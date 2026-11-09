import type { SkillDef } from "../../../../types/skill";

/** Steady Pace. Design: docs/skills/mirel.md. Values: walk: share faster she walks inside her own Stillfield; contact: share less contact damage foes inside deal; refill: share of the usual Sand refill she gets while the field stands; follow: px/s the field follows her; radius: pixels the field's radius grows; eye: 1 the field centres on her and moves with her (evolution) */
export const STEADY_PACE: SkillDef = {
  id: "m_pace",
  name: "Steady Pace",
  kind: "movement",
  risk: "easy",
  button: "K",
  text: "She walks faster inside her own Stillfield, and the field shelters her.",
  levels: [
    {
      text: "Walk 30% faster in your Stillfield.",
      values: { walk: 0.3, contact: 0, refill: 0, follow: 0, radius: 0, eye: 0 },
    },
    {
      text: "Foes inside deal 25% less contact damage.",
      values: { walk: 0.3, contact: 0.25, refill: 0, follow: 0, radius: 0, eye: 0 },
    },
    {
      text: "Sand refills at half rate while it stands.",
      values: { walk: 0.3, contact: 0.25, refill: 0.5, follow: 0, radius: 0, eye: 0 },
    },
    {
      text: "Walk 45% faster in your Stillfield.",
      values: { walk: 0.45, contact: 0.25, refill: 0.5, follow: 0, radius: 0, eye: 0 },
    },
    {
      text: "The field follows you at 20 px/s.",
      values: { walk: 0.45, contact: 0.25, refill: 0.5, follow: 20, radius: 0, eye: 0 },
    },
    {
      text: "The field's radius grows 10 px.",
      values: { walk: 0.45, contact: 0.25, refill: 0.5, follow: 20, radius: 10, eye: 0 },
    },
    {
      text: "Foes inside deal 40% less contact damage.",
      values: { walk: 0.45, contact: 0.4, refill: 0.5, follow: 20, radius: 10, eye: 0 },
    },
    {
      text: "Walk 60% faster; it follows at 30 px/s.",
      values: { walk: 0.6, contact: 0.4, refill: 0.5, follow: 30, radius: 10, eye: 0 },
    },
  ],
  evolution: {
    partner: "m_patience",
    name: "Calm Eye",
    text: "The field centres on her and moves with her.",
    row: {
      text: "The field moves with you.",
      values: { walk: 0.6, contact: 0.4, refill: 0.5, follow: 30, radius: 10, eye: 1 },
    },
  },
};
