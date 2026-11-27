from constants import ELEMENTS, HINTS, LOOKS, PORTRAIT_OF, SPRITE_STYLE, SPRITES
from models import Icon

STYLE = (
    "Style: chunky low-resolution pixel art skill icons, like the ability icons of a SNES or GBA action RPG. Each icon is "
    "drawn on a 32 by 32 pixel grid and enlarged with nearest-neighbour scaling, so it is built from big hard square "
    "pixels. One bold subject per icon that reads at a glance at 32 by 32 pixels: a weapon, an object, a creature or a "
    "magic effect, large and filling its cell, plus at most one supporting shape. Keep it simple: no scattered "
    "particles, sparks, debris, rocks, dust or tiny details, and empty space round the subject. Never draw a whole "
    "person or the hero's body; at most a hand or gauntlet. Draw a foe only when the skill is about hitting one, as a "
    "simple violet-grey blob silhouette with a pale eye. Every shape has a solid 1-pixel near-black outline. Flat colours with two "
    "or three hard tones each, about a dozen colours per icon, strong contrast so it reads on a near-black screen. No "
    "gradients, no glow, no haze, no light rays fading out, no blur, no semi-transparent pixels, no drop shadow, no "
    "anti-aliasing."
)

LAYOUT = (
    "Lay the icons out in an exact grid of {cols} columns and {rows} rows of equal square cells on a fully transparent "
    "background. Each icon sits centred in its own cell and fills about three quarters of it, with clear empty space "
    "between neighbouring icons; nothing crosses into another cell. No text, letters, numbers, labels, frames, borders, "
    "badges, round backgrounds or tiles behind the icons."
)

ELEMENT_RULE = (
    "Element colour coding: the energy, light and effect of each icon are drawn only in its element's colours, so the "
    "element reads at a glance; the element colour covers most of the coloured area of the icon. {elements}. Weapons "
    "and gear keep their own colours, but the hero's own accent colour never replaces the element colour."
)

EVOLVED_RULE = (
    "An evolved icon is a grander, more powerful version of the base icon just before it: the same subject, element and "
    "pose, with more energy, a bigger effect and a small gold four-point star in its top right corner. Only evolved "
    "icons carry the gold star."
)

UNIQUE_RULE = (
    "Every icon must look clearly different from every other icon in the sheet and from the reference icons: give each "
    "its own subject, composition and silhouette. Do not repeat the same weapon-plus-foe layout: show a foe in only a "
    "few icons of the sheet, and vary between the weapon, a symbol of the effect, a creature, a shape of energy and "
    "close-ups."
)


def subject(icon: Icon) -> str:
    hint = HINTS.get(icon.id)
    return f" Show: {hint}." if hint else ""


def cell_line(n: int, icon: Icon, icons: list[Icon], every: dict[str, Icon]) -> str:
    element = ELEMENTS.get(icon.element, "")
    if icon.element not in ELEMENTS and icon.set in PORTRAIT_OF:
        return f"{n}. {icon.name} (no element: drawn in the hero's own colours and gear):{subject(icon)}"
    if icon.element not in ELEMENTS:
        return f"{n}. {icon.name}: {icon.text}{subject(icon)}"
    if icon.set == "elements":
        return f"{n}. The {icon.name} element emblem ({ELEMENTS[icon.element]})."
    if not icon.evolved:
        return f"{n}. {icon.name} ({element}): {icon.text}{subject(icon)}"
    base = every[icon.base]
    place = next((i for i, other in enumerate(icons, 1) if other.id == base.id), None)
    of = f"icon {place}" if place else f"the {base.name} icon ({base.text}{subject(base)})"
    return f"{n}. {icon.name}, evolved ({element}): {icon.text} A grander version of {of}, with the gold star."


def sheet_prompt(icons: list[Icon], every: dict[str, Icon], cols: int, rows: int, style_reference: bool) -> str:
    sets = sorted({icon.set for icon in icons})
    looks = " ".join(LOOKS[s] for s in sets)
    refs = []
    if any(s in PORTRAIT_OF for s in sets):
        refs.append("The attached portrait shows the hero's colours and gear; draw the gear, not the face.")
    if style_reference:
        refs.append(
            "The attached icon sheet is the approved style of this icon set: match its pixel size, outline weight, "
            "palette and level of detail exactly, but draw new subjects."
        )
    elements = "; ".join(ELEMENTS.values())
    parts = [
        f"A sheet of {len(icons)} pixel art skill icons for Warpblade, a dark-fantasy pixel action game.",
        looks,
        " ".join(refs),
        STYLE,
        LAYOUT.format(cols=cols, rows=rows),
        f"Fill only the first {len(icons)} cells and leave the remaining cells empty."
        if len(icons) < cols * rows
        else "",
        ELEMENT_RULE.format(elements=elements) if any(icon.element in ELEMENTS for icon in icons) else "",
        EVOLVED_RULE if any(icon.evolved for icon in icons) else "",
        UNIQUE_RULE,
        "Cells, left to right, then top to bottom:",
        "\n".join(cell_line(n, icon, icons, every) for n, icon in enumerate(icons, 1)),
    ]
    return "\n\n".join(part for part in parts if part)


def sprite_prompt(ids: list[str], cols: int, rows: int) -> str:
    parts = [
        f"A sheet of {len(ids)} pixel art pickups and props for Warpblade, a dark-fantasy pixel action game: the coins, "
        "experience gems, healing and mana beads, heart and mana crystals and treasure chest the hero picks up.",
        "The attached icon sheet is the approved style of the game's skill icons: match its outline weight, palette "
        "and flat pixel shading exactly, but draw these new objects.",
        SPRITE_STYLE,
        LAYOUT.format(cols=cols, rows=rows),
        f"Fill only the first {len(ids)} cells and leave the remaining cells empty." if len(ids) < cols * rows else "",
        "Cells, left to right, then top to bottom:",
        "\n".join(f"{n}. {SPRITES[i]}." for n, i in enumerate(ids, 1)),
    ]
    return "\n\n".join(part for part in parts if part)
