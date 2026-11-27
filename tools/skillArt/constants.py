from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
MANIFEST = HERE / "manifest.json"
RAW = HERE / "raw"
SHEETS = RAW / "sheets"
CELLS = RAW / "cells"
OUT = ROOT / "src/skillArt/assets"
HEROES = ROOT / "src/generatedHeroArt/assets"
ENV = ROOT / ".env.local"

MODEL = "gpt-image-2.5-sunburst"
FALLBACK_MODEL = "gpt-image-2.5-flare"

ICON = 32
INNER = 30
COLOURS = 24
OPAQUE = 128
INK = (10, 6, 18, 255)

ELEMENTS = {
    "blaze": "Blaze: orange and red fire with a yellow-white core",
    "frost": "Frost: pale icy blue, cyan and white ice",
    "storm": "Storm: bright yellow lightning with a white-hot core",
    "venom": "Venom: acid green poison and toxic lime",
    "void": "Void: deep violet and lilac rift energy",
}

LOOKS = {
    "aldric": (
        "Aldric, the shield knight: blond, silver plate armour with navy cloth and gold trim. His gear is a straight steel "
        "longsword and a white kite shield with a gold sun emblem. His own light is warm dawn gold."
    ),
    "brynn": (
        "Brynn, the heavy blade: a small red-haired fighter in a red headband. Her gear is Anvilheart, a huge broad slab "
        "greatsword as tall as she is, with a heavy iron guard and a small crimson crystal. Her slams crack the floor; "
        "her slashes, shockwaves and cracks glow in the skill's element colour, never crimson."
    ),
    "calder": (
        "Calder, the trigger blade: a drifter with brass goggles and a red scarf. His gear is a gunmetal gunblade with a "
        "revolver cylinder at the guard; he fires brass rounds whose tracers, muzzle blasts and explosions take the "
        "skill's element colour, never green unless the skill is Venom."
    ),
    "cerise": (
        "Cerise, the duelist: a crimson-haired fencer in white with a rose motif. Her gear is a needle-thin rapier with a "
        "curled silver guard and a rose crystal; rose motifs follow her thrusts, but petals, roses and light take the "
        "skill's element colour (green thorned roses for Venom, yellow for Storm, violet for Void)."
    ),
    "kael": (
        "Kael, the warp knight: a silver-haired spell swordsman in navy with a red scarf. His gear is a pale cyan crystal "
        "sword that he throws and warps to, and he casts spells into his combo."
    ),
    "saya": (
        "Saya, the quickdraw: a navy-haired swordswoman in white and navy. Her gear is a katana and its black lacquer "
        "scabbard; her cuts are drawn like ink brush strokes under a crescent moon."
    ),
    "vesper": (
        "Vesper, the twin blade: a lavender-haired fighter in dark violet. Her gear is a pale long blade with a violet "
        "crystal at the guard and a dark broad short blade; dusk and crescent moon motifs, with her cuts in the "
        "skill's element colour."
    ),
    "yun": (
        "Yun, the sword sage: a dark-haired sage in white and jade green robes. His gear is a straight jian with a jade "
        "guard and a red tassel; translucent spirit swords hover around him and his cuts flow as crescents of qi, both "
        "in the skill's element colour."
    ),
    "zafir": (
        "Zafir, the dervish: a desert dancer in an orange turban and white and gold clothes. His gear is a curved "
        "scimitar; he spins in whirling rings of sand, wind lines and falling glass shards and leaves bleeding wounds. "
        "The sand and wind take the skill's element colour: green poison sand for Venom, violet for Void, yellow "
        "lightning sand for Storm, orange fire for Blaze, icy blue for Frost."
    ),
    "arts": (
        "Rift Arts: elemental spells any hero can carry, each a single magic projectile or effect, drawn without a hero "
        "or weapon."
    ),
    "elements": (
        "Element emblems: a single bold symbol for each of the five elements, drawn as a clean centred badge-free "
        "symbol with no hero, weapon or foe."
    ),
    "cards": (
        "Growth cards: plain stat upgrades with no element, drawn as a single object in neutral steel, gold and white "
        "with no hero or foe."
    ),
}

PORTRAIT_OF = {hero: hero for hero in LOOKS if hero not in ("arts", "elements", "cards")}

HINTS = {
    "honing_whetstone": "a whetstone grinding a sword edge, a bright spark at the edge",
    "honing_focus": "a glowing arcane crystal orb held in an open hand, a ring of runes round it",
    "honing_keenEye": "a sharp eye inside a crosshair with a gold glint",
    "deeper_charge": "a sword hilt-down inside a filling charge gauge of three rising gold chevrons",
    "al_rally": "a blazing orange sun disc high in the sky with one thick pillar of fire falling from it to the floor",
    "al_oathsworn": "a ghostly violet knight of void light, helmeted head and shoulders, raising a sword",
    "al_lion": "the roaring head of a lion made of orange and red fire, its mane a ring of flames",
    "br_cleave": "a huge greatsword sweeping one wide flat arc of fire, three small foe silhouettes dragged along it",
    "br_arc": "a single flying crescent of fire with no sword, bursting into an explosion where it hits",
    "br_cinder": "a close-up of a greatsword edge glowing red-hot, glowing embers and coals dripping from it",
    "br_slam": "a shockwave of yellow lightning running along a cracked floor line away from a greatsword point",
    "za_whirling": "a scimitar in the centre with two sand crescents flying out to the left and to the right",
    "za_unbroken": "a scimitar with a yellow lightning spell orb pouring its power into the blade",
    "za_storm": "a tall sandstorm tornado with yellow lightning bolts inside it",
    "za_falling": "a scimitar plunging point-down into the floor, a ring of fiery orange sand splashing out both ways",
    "za_arrival": "a glowing yellow warp portal with a flat ring of sand spinning round it",
    "ce_bloom": "a large green rose in full bloom with a ring of sharp petal blades round it",
    "ce_weep": "a rose-shaped mark sigil dripping green poison drops",
    "ce_curse": "a wilting rose on a drooping thorny stem, a green curse wisp rising from it",
    "ce_petals": "five sharp green petal blades darting outward like thrown daggers",
    "ce_tempest": "a tall swirling tornado of green rose petals around an upright rapier",
    "ca_trigger": "a gunblade slash with a bullet bursting out of the cut, yellow lightning sparks",
    "yu_drift": "a single green leaf riding a gust of poison wind, a thin green cut line trailing behind it",
    "yu_bleed": "a jian surrounded by many tiny crossing green cut marks, green poison drops falling",
    "sa_stain": "a large splash of green ink poison soaking into a round seal stamp",
    "sa_trail": "a long horizontal brush stroke of green ink dripping poison drops along its length",
    "sa_crescent": "a wide violet crescent wave rolling forward like an ocean wave, no sword",
    "ve_night": "a foe silhouette tossed into the air under a starry violet night cloud cutting into it",
    "ve_twin": "two identical blade-wielding violet phantom shadows mirrored back to back",
    "ve_slip": "a fast streak of icy wind slicing through a line of three small foe silhouettes",
    "ve_grace": "a pale blue ghostly dusk shade with a crescent shield of frost round it, untouchable",
    "br_crater": "a bright ring of yellow lightning bursting up out of a round crater in a stone floor, the greatsword above it",
    "ca_hound": "a snarling hound head in profile made of flat bright acid-green venom, a brass gear collar, jaws open",
    "ca_pointblank": "a gunblade raised in a parry, a big yellow lightning muzzle flash firing from its cylinder",
}
