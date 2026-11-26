import { knownSpells } from "../../game/arts";
import { deny } from "../../game/hero/deny";
import { withBuild } from "../../game/skills/query";
import { hero } from "../../game/state";
import { sfx } from "../../services/audio";
import type { DrillInput, DrillProfile, DrillSpell, Fighter, Recharge, Session, SpellBook } from "../../types/drill";
import { SPELL_RELEASE_RECOVERY, SPELL_SELECTION_CUE } from "../constants";
import { idleRecharge, startRecharge, tickRecharge } from "./recharge";
import { launchSpell } from "./spellStrike";
import { infuseSword } from "./swordInfusion";

export function createSpellBook(profile: DrillProfile): SpellBook {
  return { selected: profile.spells[0], recharges: {}, selectionCue: 0 };
}

export function spellRecharge(book: SpellBook, spell: DrillSpell): Recharge {
  book.recharges[spell.id] ??= idleRecharge();
  return book.recharges[spell.id];
}

export const spellReady = (book: SpellBook, spell: DrillSpell): boolean => spellRecharge(book, spell).remaining === 0;

export const canPaySpell = (spell: DrillSpell): boolean => hero.mp >= spell.mp;

export function tickSpellBook(book: SpellBook, dt: number): void {
  book.selectionCue = Math.max(0, book.selectionCue - dt);
  for (const recharge of Object.values(book.recharges)) {
    tickRecharge(recharge, dt);
  }
}

export function hastenSpells(book: SpellBook, seconds: number): void {
  for (const recharge of Object.values(book.recharges)) {
    recharge.remaining = Math.max(0, recharge.remaining - seconds);
  }
}

export function readySpell(book: SpellBook, spell: DrillSpell): void {
  spellRecharge(book, spell).remaining = 0;
}

export function tickSpellRelease(h: Fighter, dt: number): void {
  if (h.spellRelease) {
    h.spellRelease.life -= dt;
    if (h.spellRelease.life <= 0) {
      h.spellRelease = null;
    }
  }
}

function select(book: SpellBook, spell: DrillSpell): void {
  book.selected = spell;
  book.selectionCue = SPELL_SELECTION_CUE;
}

function cycle(session: Session): void {
  const book = session.fighter.spellBook;
  const known = knownSpells(session.profile);
  if (known.length < 2) {
    return;
  }
  const current = known.indexOf(book.selected);
  select(book, known[(current + 1) % known.length]);
  sfx.pickup();
}

function nextSpell(book: SpellBook, known: readonly DrillSpell[]): DrillSpell | undefined {
  const start = Math.max(0, known.indexOf(book.selected));
  for (let i = 0; i < known.length; i++) {
    const spell = known[(start + i) % known.length];
    if (spellReady(book, spell) && canPaySpell(spell)) {
      return spell;
    }
  }
  return undefined;
}

function spend(session: Session, spell: DrillSpell): void {
  const book = session.fighter.spellBook;
  hero.mp -= spell.mp;
  startRecharge(spellRecharge(book, spell), withBuild("cooldown", spell.cooldown * session.modifiers.spellCooldown));
  if (book.selected !== spell) {
    select(book, spell);
  }
}

function release(session: Session, spell: DrillSpell): void {
  const h = session.fighter;
  h.warp = null;
  h.guardAge = null;
  h.parryAge = null;
  h.enhancedGuard = 0;
  h.dashTime = 0;
  h.airDashActive = false;
  h.jumpBoost = false;
  h.vx = 0;
  h.spellRelease = { life: SPELL_RELEASE_RECOVERY };
  launchSpell(session, spell);
}

export function readSpellBook(session: Session, input: DrillInput): void {
  const h = session.fighter;
  const book = h.spellBook;
  const known = knownSpells(session.profile);
  book.selected = known.find((spell) => spell.id === book.selected.id) ?? book.selected;
  if (input.cycle) {
    cycle(session);
  }
  if (!input.cast || h.stun > 0) {
    return;
  }
  const spell = nextSpell(book, known);
  if (!spell) {
    deny(known.some((option) => spellReady(book, option)) ? "mp" : "cast");
    return;
  }
  spend(session, spell);
  if (h.swing) {
    infuseSword(session, spell);
    return;
  }
  release(session, spell);
}
