import type { Draft } from '@shared/draft';
import { type MotionId, motionId } from '@shared/motionId';
import { create } from 'zustand';
import { FIRST_MOTION, GAME_CLIPS, HERO_MOTION } from '@/constants/heroMotion';
import type { ClipFrames, ClipSource, SaveStatus } from '@/types/studio';
import { clipText, sameClip } from '@/utils/edited';

const HISTORY_LIMIT = 200;
const SENT_LIMIT = 20;

interface MotionState {
  /** The hero's clip open on the stage. */
  motion: MotionId;
  current: ClipFrames;
  past: ClipFrames[];
  future: ClipFrames[];
  /** Bumped on every change to the open clip, so autosave knows what to write; 0 right after opening. */
  revision: number;
  /** The saved or edited frames of every clip the owner has changed. */
  drafts: Partial<Record<MotionId, ClipFrames>>;
  /** Every clip as the game plays it now. */
  game: Record<MotionId, ClipFrames>;
  /** The drafts this page saved lately, as their files hold them, so their echo from disk is not read as a change. */
  sent: Partial<Record<MotionId, string[]>>;
  ready: boolean;
  saveStatus: SaveStatus;
  boot: (drafts: readonly Draft[]) => void;
  open: (motion: MotionId) => void;
  /** Applies an edit. With `record` false the change joins the last undo step, as during a drag. */
  change: (edit: (clip: ClipFrames) => ClipFrames, record?: boolean) => void;
  /** Starts an undo step for a gesture whose changes follow with `record` false. */
  checkpoint: () => void;
  undo: () => void;
  redo: () => void;
  setSaveStatus: (status: SaveStatus) => void;
  /** Notes a draft this page is saving. */
  sending: (motion: MotionId, frames: ClipFrames) => void;
  /** Takes a clip changed on disk. The open clip shows it at once, and undo goes back to what was there. */
  receive: (source: ClipSource, motion: MotionId, frames: ClipFrames) => void;
}

/** The open clip with its undo history, and the drafts of every clip. */
export const useMotionStore = create<MotionState>((set) => {
  const replace = (
    state: MotionState,
    current: ClipFrames,
    past: ClipFrames[],
    future: ClipFrames[],
  ) => ({
    current,
    past,
    future,
    revision: state.revision + 1,
    drafts: { ...state.drafts, [state.motion]: current },
  });
  const reload = (state: MotionState, motion: MotionId, frames: ClipFrames) =>
    state.motion !== motion || sameClip(state.current, frames)
      ? {}
      : {
          current: frames,
          past: [...state.past, state.current].slice(-HISTORY_LIMIT),
          future: [],
          saveStatus: 'reloaded' as const,
        };
  return {
    motion: FIRST_MOTION,
    current: GAME_CLIPS[FIRST_MOTION],
    past: [],
    future: [],
    revision: 0,
    drafts: {},
    game: GAME_CLIPS,
    sent: {},
    ready: false,
    saveStatus: 'saved',
    boot: (drafts) =>
      set((state) => {
        const known = Object.fromEntries(
          drafts
            .map((draft) => [motionId(draft.hero, draft.clip), draft] as const)
            .filter(([id]) => HERO_MOTION.has(id))
            .map(([id, draft]) => [id, { frames: draft.frames, snaps: draft.snaps }]),
        );
        return {
          drafts: known,
          ready: true,
          current: known[state.motion] ?? state.game[state.motion],
        };
      }),
    open: (motion) =>
      set((state) => ({
        motion,
        current: state.drafts[motion] ?? state.game[motion],
        past: [],
        future: [],
        revision: 0,
      })),
    change: (edit, record = true) =>
      set((state) => {
        const next = edit(state.current);
        if (next === state.current) {
          return state;
        }
        const past = record ? [...state.past, state.current].slice(-HISTORY_LIMIT) : state.past;
        return replace(state, next, past, []);
      }),
    checkpoint: () =>
      set((state) => ({ past: [...state.past, state.current].slice(-HISTORY_LIMIT), future: [] })),
    undo: () =>
      set((state) => {
        const previous = state.past.at(-1);
        return previous
          ? replace(state, previous, state.past.slice(0, -1), [state.current, ...state.future])
          : state;
      }),
    redo: () =>
      set((state) => {
        const next = state.future[0];
        return next
          ? replace(state, next, [...state.past, state.current], state.future.slice(1))
          : state;
      }),
    setSaveStatus: (saveStatus) => set({ saveStatus }),
    sending: (motion, frames) =>
      set((state) => ({
        sent: {
          ...state.sent,
          [motion]: [...(state.sent[motion] ?? []), clipText(frames)].slice(-SENT_LIMIT),
        },
      })),
    receive: (source, motion, frames) =>
      set((state) => {
        if (source === 'game') {
          const game = { ...state.game, [motion]: frames };
          return state.drafts[motion] ? { game } : { game, ...reload(state, motion, frames) };
        }
        const draft = state.drafts[motion];
        if (state.sent[motion]?.includes(clipText(frames)) || (draft && sameClip(draft, frames))) {
          return state;
        }
        return { drafts: { ...state.drafts, [motion]: frames }, ...reload(state, motion, frames) };
      }),
  };
});
