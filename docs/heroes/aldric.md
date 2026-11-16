# Aldric, the shield knight

The third hero of the sword roster (patch 0.11.0, task T-mac-260).
Id `aldric`, name Aldric (he/him), title "The shield knight".
Price 300 coins (`CharacterDef.price`), the first paid hero.
Accent `#ffe08a` (dawn gold), the gold-on-white family of the roster.
His module is `src/heroes/aldric/`, his skills are in `docs/skills/aldric.md`.

## Identity

Aldric is a knight captain who fights from behind a raised shield.
He is the only hero who attacks and advances while his guard is up: he walks into a crowd with the shield raised, bashes from behind it, and turns every blow he stops into Valor.
When Valor is full his sword lights up, and for a few seconds every blow adds light and throws a short wave.
He is the safe hero: the slowest damage in the roster and the best block, and he is never helpless.

Look: silver-blue plate over a white tabard with a gold hem, a deep blue half cape with a gold lining hanging from his far shoulder, and short fair hair swept back from the brow in a few wide wedges.
His sword is a broad arming sword with a gold cross guard; his shield is a white kite shield with a gold rim and a rising-sun crest, and the warp crystal sits in the centre of the sun.
At rest he stands with the shield grounded in front of his far leg and the sword lowered at his side, weight back on the rear foot.

## Base kit by button

| Key | Aldric |
| --- | --- |
| A / D | Walk; a double tap runs |
| W | Jump, and again in the air |
| J tapped | Three blows: Oath cut, Shield bash (staggers long, breaks a foe's guard), Crest breaker (an overhead that knocks down). In the air: Sky cut, then Shield fall, a plunge shield first that spikes foes under him and shakes the floor where he lands |
| J held | The shared warp. He arrives shield first behind a Bulwark that takes the next blow |
| K | Guard: blocks every blow from the front with nothing let through, for the least stamina in the roster. He walks slowly with the guard up and does not turn. J with the guard up is a Guard bash, and the guard stays up through it. A Guard bash within a moment of a block is a Counterbash. A parry answers with a Stun bash that knocks the attacker down |
| L | The shared front dodge |
| I tapped | The selected ability: Shield Rush or Sunpillar, then the spells his skills teach. Pressed while the string is open it goes off at once, and after the Shield bash it hits harder (Shieldcast) |
| I held | The wide form: Shield Rush ends in a burst of light; Sunpillar calls three pillars in a row |
| O | Switch ability |
| U | Sanctuary: he plants the shield and a dome of light burns every foe inside it, breaks foe shots and halves the damage he takes while he stands in it |

### How each quality of Kael's lands on Aldric

- Responsive blows: each blow of the string winds up against itself, snaps on its hit frame and settles back to his guard. The string is three presses, a little slower than Kael's four.
- Reach: the shared warp, plus Shield Rush, a short shove forward that carries foes with him.
- A cancel rule between string and abilities: Shieldcast. An ability pressed in an open string skips its wind-up, and after the Shield bash it hits harder.
- His abilities may in turn be cut by the warp, the guard, the dodge, another ability or the ultimate: Shield Rush once its travel is over, a call of light once the light has gone. A press made earlier waits for that moment; a tapped K is not kept, a held K raises the guard then.
- A parry follow-up: the Stun bash on the parry itself, and since the guard stays up, a Guard bash right after it.
- A way to continue after a launch: Sky cut and Shield fall, which drives an airborne foe into the floor.
- A timing reward of his own: the Counterbash, a Guard bash pressed just after a block, a sure critical hit worth twice the Valor. The shared Keen timing on J also holds.
- Short recharges: Shield Rush 3 s, Sunpillar 4.5 s, the Guard bash 0.4 s. Nothing locks him out of the rest of the kit.

## The meter: Valor

A bar labelled VL under stamina, in gold, from 0 to 100.
Blocks, parries and bashes that land fill it; the Counterbash and the parry fill it most.
At 100 it empties into Radiance: for a few seconds his blows deal extra light damage and each blow of the string or a bash throws a short wave of light ahead.
The bar glows while Radiance runs and drains as it runs out.
Valor does not drain on its own, so a careful player keeps what they built.

## Numbers

Every number lives in `src/heroes/aldric/constants/`; this table is the design at the time of writing.

| What | Value |
| --- | --- |
| Base stats | AD 10, AP 9, HP 120, MP 90, stamina 110, crit 4%, move 0.95, attack speed 1 |
| Growth per level | HP 1.3, MP 0.4 |
| String | Oath cut 1.2 AD, Shield bash 1.0 AD (stagger 0.7 s, breaks guards), Crest breaker 2.4 AD (knocks down 0.9 s) |
| Air | Sky cut 1.0 AD, Shield fall 1.2 AD on the way down and 1.3 AD in a ring of 28 px where he lands |
| Guard | lets 0% through, 8 stamina a block, walks at 45% of his walk speed |
| Guard bash | 0.9 AD, every 0.4 s; as a Counterbash within 0.35 s of a block, 2.0 AD and a sure crit |
| Stun bash (parry) | 1.3 AD, knocks the attacker down for 1.1 s |
| Valor | block 12, parry 25, Guard bash hit 8, Counterbash 16, Shield bash hit 6; Radiance 6 s, +35% light on each of his own blows, a wave of 0.5 AD |
| Bulwark | takes the next blow within 2.5 s of a warp arrival |
| Shield Rush | 12 MP (wide 18), 3 s, 44 px forward, 1.4 AP to each foe it meets; wide adds a 30 px burst of 1.0 AP |
| Sunpillar | 16 MP (wide 24), 4.5 s, 2.4 AP on the nearest foe ahead within 130 px; wide calls three pillars 28 px apart |
| Shieldcast | an ability cast in an open string after the Shield bash hits 25% harder |
| Sanctuary | dome of 40, 52, 64 or 80 px by charge level, 3 s, six burns at 0.2 of the charge level's power each |

## How Aldric differs from the other eight

- Kael casts elemental spells into his string and blinks behind foes after a parry. Aldric has one element, light, and his parry keeps him where he is, shield up.
- Cerise has the weakest block and the best parry, and chains ripostes on rhythm. Aldric has the strongest block and a modest parry; his timing reward comes after a block.
- Vesper lives in the air and grows faster the longer she hits. Aldric is a ground fighter with a plain two-blow air string that ends on the floor.
- Saya stores cuts and releases them when she sheathes. Aldric's damage lands when the blow lands.
- Yun fights at mid range with spirit swords. Aldric's reach is his arm, his shield and a short rush.
- Brynn swings through blows with armour and clears crowds with one wide blow. Aldric does not take blows at all: he stops them in front and walks on.
- Zafir walks while he attacks and cuts on both sides. Aldric walks while he guards, and only toward the front.
- Calder manages a chamber of rounds fired on impact. Aldric's resource fills from defence, and he spends it all at once in Radiance.

## What I chose not to build

- No armour while attacking: Brynn owns it, and Aldric's safety is the guard itself.
- No turning while the guard is up: walking backward behind the shield is the point, and an attack that turns the hero was removed from the old heroes.
- No long charge: Shield Rush moves 44 px, so it never carries him away from the fight or locks out the kit.
- No healing in the base kit: the Mending Light skill heals, and the base kit stays about blocking.
- No Valor spender on a button: Radiance starts by itself at full, so no new key or long recharge is needed.
