import { emitSkillEvent } from "../../game/skills/events";
import { sfx } from "../../services/audio";
import type { DrillInput, DrillProfile, Fighter, Session, SpellBook } from "../../types/drill";
import { SPELL_PREPARATION, SPELL_RELEASE_RECOVERY, SPELL_SELECTION_CUE } from "../constants";
import { launchSpell } from "./spellStrike";
import { infuseSword } from "./swordInfusion";

export function createSpellBook(profile: DrillProfile): SpellBook {
  return { selected: profile.spells[0], preparation: null, selectionCue: 0 };
}

export function tickSpellBook(book: SpellBook, dt: number): void {
  book.selectionCue = Math.max(0, book.selectionCue - dt);
  if (book.preparation) {
    if (book.preparation.remaining === 0) {
      book.preparation.readyAge += dt;
    } else {
      book.preparation.remaining = Math.max(0, book.preparation.remaining - dt);
    }
  }
}

export function tickSpellRelease(h: Fighter, dt: number): void {
  if (h.spellRelease) {
    h.spellRelease.life -= dt;
    if (h.spellRelease.life <= 0) {
      h.spellRelease = null;
    }
  }
}

function cycle(session: Session): void {
  const book = session.fighter.spellBook;
  const known = session.profile.known();
  if (known.length < 2) {
    return;
  }
  const current = known.indexOf(book.selected);
  book.selected = known[(current + 1) % known.length];
  book.selectionCue = SPELL_SELECTION_CUE;
  sfx.pickup();
}

export function readSpellBook(session: Session, input: DrillInput): void {
  const h = session.fighter;
  const book = h.spellBook;
  if (input.cycle && !book.preparation) {
    cycle(session);
  }
  if (!input.cast || h.stun > 0) {
    return;
  }
  if (h.swing) {
    if (book.preparation?.remaining === 0) {
      infuseSword(session, book.selected);
      book.preparation = null;
    }
    return;
  }
  if (!book.preparation) {
    const duration = Math.max(0, SPELL_PREPARATION * session.modifiers.preparation);
    book.preparation = { duration, remaining: duration, readyAge: 0 };
    book.selectionCue = 0;
    emitSkillEvent({ type: "prepare", spell: book.selected.id });
    return;
  }
  if (book.preparation.remaining > 0) {
    return;
  }
  book.preparation = null;
  h.warp = null;
  h.guardAge = null;
  h.parryAge = null;
  h.enhancedGuard = 0;
  h.dashTime = 0;
  h.airDashActive = false;
  h.jumpBoost = false;
  h.vx = 0;
  h.spellRelease = { life: SPELL_RELEASE_RECOVERY };
  launchSpell(session, book.selected);
}
