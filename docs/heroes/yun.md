# Yun, the sword sage

The sixth hero of the sword roster (patch 0.11.0).
Id `yun`, name Yun (he/him), title "The wandering sword sage".
Blurb: "A travelling sage with a straight jian and a long jade tassel. His cuts flow in circles, and spirit swords hover behind him to repeat every blow at range."
Price: 750 coins, the sixth price on the roster's fixed list.
Accent `#5fd6a4` (jade green). No other hero of the roster is green: Calder's phosphor green is a tracer colour on gunmetal, and Kael's cyan is a blue.

All of his code is in `src/heroes/yun/`, laid out as `docs/hero-module.md` describes.
His skill tables are in `docs/skills/yun.md`.

## Identity

Yun is the only hero with spirit swords: translucent jade copies of his jian that hover behind him.
Each spirit sword he holds repeats his blows as a thrust that reaches past his own blade, and his abilities send the swords out.
His loop is set up, then cash in: the string and the parry earn swords, the abilities spend them, and the swords he has spent come back over time.
His risk profile is easy to timed.
He fights at middle range: his own blade reaches like Kael's, and the swords reach about twice as far.

## Look

- A travelling sage in layered pale robes with jade trim: a long robe with a crossed collar, wide long sleeves, a jade sash at the belt with two hanging ends, and slate trousers over soft cloth shoes.
- Black hair with a green sheen, tied in a topknot with a jade pin, and long ends that fall from the knot and trail behind him.
- The sword is a jian: a straight, narrow double-edged blade with a raised ridge down its middle, a small winged guard set with a jade warp crystal, a round pommel and a long jade tassel that hangs from the pommel and trails as he moves.
- He holds no off-hand item. His far hand forms the sword fingers (two fingers straight) and points the spirit swords where they go.
- His idle stands with the weight on the back leg, the jian held low with its point toward the floor ahead and the sword fingers raised before his chest.
- Colour family: jade green, from deep pine through jade to a pale mint and white. Slashes, rings, sparks, the warp line, the spirit swords and every effect are in that ramp.
- Silhouette: the topknot, the long sleeves and robe skirt, and the long straight blade with its tassel. Kael's is the short swept hair, the scarf and the coat.

## Base kit by button

| Key | Yun |
| --- | --- |
| A / D | Walk; a double tap runs |
| W | Jump; again in the air for the second jump. His fall is floatier than other heroes' |
| J tapped | Flowing string of four cuts, the same every time. Each held spirit sword repeats each blow as a thrust ahead |
| J held | The shared warp: he throws the jian, rides it in, and the spirit swords he holds strike the foe once each as he lands |
| K | Guard: the spirit swords fan out before him as a screen. A parry sends a qi wave ahead and gives a spirit sword |
| L | The shared front dodge |
| I tapped | The selected ability: Sword Stream or Sword Lotus, and the spell skills he learns |
| I held | The wide form of the selected ability |
| O | Switch ability |
| U | Jade Rain, charged by holding |

### The string on J

Four flowing circular cuts, the same in every place:

1. Willow Cut: a step and a level cut from high behind to low ahead.
2. Turning Leaf: the blade circles under and rises in a backhand cut over his head.
3. Crane Wheel: he turns once on the spot, his back to the camera for a frame, and the blade comes round in a flat cut at the chest.
4. Returning Tide: the blade circles high and comes down in a long arc that knocks the foe down and sends a short crescent of qi along the floor.

Every cut carries the tassel round in a trail.
Each blow before the last staggers long enough to reach the next, and the last one knocks down.
When the last cut lands on a foe it gives a spirit sword.

### Spirit swords (SW bar)

- He holds 0 to 4 spirit swords, shown in four cells on the SW bar under stamina; the bar glows when all four are held.
- A run starts with 2.
- While he holds fewer than 2, one comes back every 2.5 seconds.
- Returning Tide landing on a foe gives one, and a parry gives one, up to 4.
- Sword Echo: after each blow of the string, each held sword thrusts ahead one after another, from 22 to 64 pixels in front of him, for 0.22 times attack damage each.
- A Keen blow (a J pressed in the moment after a blow lands) makes the echo of the next blow a sure critical hit and lets it reach a third farther. This is his timing reward.
- The swords hover behind his shoulders in a fan and turn to follow him; they lean toward the foe as they thrust.

### Abilities on I

Both abilities spend the spirit swords he holds, and need at least one.
They cost no MP, so his MP goes to the warp and Jade Rain.

- Sword Stream: every held sword flies out along the line ahead, 150 pixels, and back to him, cutting each foe once on the way out and once on the way back, for 0.8 times ability power a cut. Held: the swords fan out at three heights and fly 210 pixels. Recharge 1.2 seconds.
- Sword Lotus: every held sword flies to a point 44 pixels ahead and spins there in a ring for 2.4 seconds, each sword cutting the foes it touches every 0.35 seconds for 0.3 times ability power. Held: the ring spins round Yun himself and follows him for 3 seconds, a little wider. Recharge 3.5 seconds.
- Free Hand, his cancel rule: an ability pressed during an open string, after a blow has landed, leaves his sword fingers at once with no cast pose, and the string stays open, so the next J carries on with the next cut.

### Air string

- Two light cuts in the air, Drifting Cut and Falling Petal, each echoed by the held swords. The second drops him a little.
- His way on after a launch: the warp's arrival throws a foe up, and his floaty jump gives the two air cuts and their echoes time to reach it.

### Guard and parry

- Sword Screen: the held swords fan out in front of him while he guards. A block lets 30% of the damage through and costs 14 stamina, both average for the roster.
- Deflecting Qi, his parry: the shared parry, then a qi wave leaves his blade and flies 120 pixels ahead, cutting each foe once for 1.2 times attack damage, and a spirit sword joins him.

### Warp extra

The shared warp in every number.
The jian flies with its tassel streaming and a jade wisp of Yun riding the blade.
On arrival, after the shared blow, each spirit sword he holds strikes the foe once for 0.12 times attack damage, so four swords add about a fifth of the arrival blow.

### Ultimate: Jade Rain

A rain of spirit swords falls on the foes on screen and converges on them, three swords to a foe, up to 18 swords.
Each foe struck takes about the shared ultimate blow for the charge level, in three cuts.
Its skill, Heaven's Grove (`yu_rain`), adds more swords, a rain that keeps falling, and spirit swords back into his hands.

## Numbers

| Stat | Yun | Kael |
| --- | --- | --- |
| Attack damage | 10 | 10 |
| Ability power | 11 | 10 |
| HP | 95 | 100 |
| MP | 100 | 100 |
| Stamina | 100 | 100 |
| Crit | 5% | 5% |
| Move | 1 | 1 |
| Combo hits | 4 | 4 |

The blows of the string deal 0.95, 1.0, 1.15 and 2.1 times attack damage, 5.2 in all against Kael's 6.25.
With two swords the echoes add 1.76 at range, and with four 3.52, so a held-up Yun out-damages Kael's string on a crowd at middle range and falls short of it point blank with no swords.

## How Yun differs from each of the other eight

- Kael casts elemental spells into his string and blinks behind the attacker after a parry. Yun casts no elements; his ranged damage is the spirit swords, his abilities spend a resource he builds, and his cast keeps the string open.
- Cerise pins one foe on a long thin line with fast thrusts and chains ripostes. Yun's cuts are wide circles, his reach comes from swords that echo his blows, and his parry gives a wave and a sword.
- Aldric walks forward behind a shield and turns blocks into Valor. Yun's guard is average and has no walk; his reward sits in the parry.
- Vesper lives in the air and grows faster the longer she hits. Yun's speed never grows; his air string is two cuts and his strength grows with swords held.
- Saya stores cuts and releases them all when she sheathes. Yun's echoes land at once, after each blow, at range.
- Brynn swings through hits with armour and clears crowds with one shockwave. Yun has no armour and spreads his damage over many light cuts.
- Zafir walks while he attacks and cuts both sides at once. Yun plants his feet for each cut and strikes in front.
- Calder fires a round on impact and counts a chamber. Yun's resource comes back on its own and fills from his finisher and parries.

## What we chose not to build

- No auto-aimed swords: every sword thrusts along his facing or goes where an ability sends it, never at a foe the game picks. Jade Rain is the one exception, as every ultimate strikes the foes on screen.
- No sword that stays out and attacks on its own as a base move. Summoned swords that act on their own are skills.
- No long travel: neither ability moves Yun.
- No turning: no blow turns him round; Crane Wheel turns his body and he ends facing the same way.
- No elements: his abilities cut, they do not burn, freeze or shock.
