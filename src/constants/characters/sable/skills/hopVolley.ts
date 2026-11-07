import type { SkillDef } from "../../../../types/skill";

/** Hop Volley: The hop back looses a primed fan. Values: bolts: bolts the hop looses; cost: stamina; seek: hop bolts bend toward foes; airHops: hops in one airtime; pierce: foes a hop bolt passes through; caltrops: attack damage of caltrops scattered on landing; slow, slowTime: the slow a hop bolt lays and its seconds; carry: the hop's length multiple; ring: the hop looses a full ring. Design: docs/skills/sable.md */
export const HOP_VOLLEY: SkillDef = {
  id: "s_hopVolley",
  name: "Hop Volley",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "The hop back looses a primed fan.",
  levels: [
    { text: "The hop looses three primed bolts.", values: { bolts: 3, cost: 22, seek: 0, airHops: 1, pierce: 0, caltrops: 0, slow: 0, slowTime: 0, carry: 1, ring: 0 } },
    { text: "The hop costs less stamina.", values: { bolts: 3, cost: 16, seek: 0, airHops: 1, pierce: 0, caltrops: 0, slow: 0, slowTime: 0, carry: 1, ring: 0 } },
    { text: "Hop bolts seek foes.", values: { bolts: 3, cost: 16, seek: 1, airHops: 1, pierce: 0, caltrops: 0, slow: 0, slowTime: 0, carry: 1, ring: 0 } },
    { text: "Hop once more in the air.", values: { bolts: 3, cost: 16, seek: 1, airHops: 2, pierce: 0, caltrops: 0, slow: 0, slowTime: 0, carry: 1, ring: 0 } },
    { text: "The hop looses five bolts.", values: { bolts: 5, cost: 16, seek: 1, airHops: 2, pierce: 0, caltrops: 0, slow: 0, slowTime: 0, carry: 1, ring: 0 } },
    { text: "Hop bolts pass through two foes.", values: { bolts: 5, cost: 16, seek: 1, airHops: 2, pierce: 2, caltrops: 0, slow: 0, slowTime: 0, carry: 1, ring: 0 } },
    { text: "Landing from a hop scatters caltrops.", values: { bolts: 5, cost: 16, seek: 1, airHops: 2, pierce: 2, caltrops: 1, slow: 0, slowTime: 0, carry: 1, ring: 0 } },
    { text: "Hop bolts slow foes, and the hop carries farther.", values: { bolts: 5, cost: 16, seek: 1, airHops: 2, pierce: 2, caltrops: 1, slow: 0.3, slowTime: 1, carry: 1.3, ring: 0 } },
  ],
  evolution: {
    partner: "s_scatter",
    name: "Wheeling Volley",
    text: "The hop turns her in the air and looses a full ring of twelve primed bolts.",
    row: { text: "The hop looses a ring of bolts.", values: { bolts: 12, cost: 16, seek: 0, airHops: 2, pierce: 2, caltrops: 1, slow: 0.3, slowTime: 1, carry: 1.3, ring: 1 } },
  },
};
