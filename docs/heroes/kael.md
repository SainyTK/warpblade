# Kael

Kael is the spell swordsman, the warp knight.
He throws his crystal longsword, appears where it lands, and casts elemental spells into his sword string.
His kit, numbers and skills are in `docs/skills/kael.md`; this note covers his look.

## Identity in the roster

Kael is the only hero who casts elemental spells into his sword string.
His colour family is crystal cyan: the menu accent `#7fe3ff`, his sword's light, his slashes, rings, warp line and sparks (`PAL.crystal`, `SPARKS.crystal`).

## Look

He is drawn on the shared rig from `src/heroes/kael/look/`, in the JRPG look language of the sword roster.

- Hair: silver, in four large swept-back spikes from the crown and the back of the head, a fringe lock over the brow, and a long tied tail with a crystal cyan band.
  Each spike has a deep blue shadow strand, a silver middle and a white glint on the top one.
- Face: one large crystal blue eye.
- Outfit: a midnight blue long coat over a steel breastplate and a single pauldron on the sword arm with a crystal set in it.
  Below the belt the coat splits into a long tail at the back, lined in crystal cyan, and a short front panel, both with a brass hem.
  A leather strap runs across the chest from the sword shoulder to the far hip, held by a brass clasp with a crystal.
  Dark trousers, plate knee guards, tall brown boots with brass bands and dark gloves stay from his first look.
- Scarf: his signature red scarf, now wider, splitting into two ends.
- Sword: the crystal longsword, longer and broader than before (reach 19 pixels).
  A crystal pommel, a wrapped grip, a brass guard whose wings sweep toward the blade around the warp crystal, then a broad cyan blade with a lit edge, a dark fuller and a clipped white point.
  The thrown sword in the warp (`game/effects/thrownSword.ts`) is drawn to the same shape.
- Colours: midnight blue and silver as the two main colours, crystal cyan as the accent, brass as the metal trim, and the red scarf.

## How the parts move

Every new part is drawn from the rig frame only, so the stage, the portrait and the afterimages match.

- The spikes and the fringe follow the head.
- The hair tail runs on the ponytail rope and the scarf ends on the scarf rope, so both trail behind travel and settle when he stops.
- The coat's long tail flares with speed and swings with the scarf rope's lag behind the neck, so it trails and settles with the scarf.
- No pose, clip, timing or hitbox changed for the new look.
  The sword's reach is only drawn: it sets the blade's light and nothing in play.

## Hero screen

Title: "The warp knight".
Blurb: "A spell swordsman. He throws his crystal sword, appears where it lands, and casts spells into his sword combo."
He stands in the shared rest pose, and the longer sword still fits the portrait (its point ends inside the 6 pixels below the feet).
