import { sfx } from "../../services/audio";
import { SPELL_ORDER, SPELL_PREPARATION, SPELL_RELEASE_RECOVERY, SPELL_SELECTION_CUE } from "../spells";
import type { Fighter, Session, SpellBook, TrainingInput } from "./model";
import { launchSpell } from "./spellStrike";
import { infuseSword } from "./swordInfusion";

export function createSpellBook(): SpellBook {
  return { selected: SPELL_ORDER[0], preparation: null, preparationSeconds: SPELL_PREPARATION, selectionCue: 0 };
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

export function readSpellBook(session: Session, input: TrainingInput): void {
  const h = session.fighter;
  const book = h.spellBook;
  if (input.cycle && !book.preparation) {
    const current = SPELL_ORDER.indexOf(book.selected);
    book.selected = SPELL_ORDER[(current + 1) % SPELL_ORDER.length];
    book.selectionCue = SPELL_SELECTION_CUE;
    sfx.pickup();
  }
  if (!input.cast || h.stun > 0) {
    return;
  }
  if (h.swing) {
    if (book.preparation?.remaining === 0) {
      infuseSword(h, book.selected);
      book.preparation = null;
    }
    return;
  }
  if (!book.preparation) {
    const duration = Math.max(0, book.preparationSeconds);
    book.preparation = { duration, remaining: duration, readyAge: 0 };
    book.selectionCue = 0;
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
