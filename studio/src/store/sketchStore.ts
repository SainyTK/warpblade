import type { EffectCel, MotionKey, Sketch } from '@shared/sketch';
import { create } from 'zustand';

/** Undo keeps this many earlier versions of the sketch. */
const HISTORY_LIMIT = 200;

interface SketchState {
  sketch: Sketch | null;
  past: Sketch[];
  future: Sketch[];
  /** Bumped on every change, so autosave knows what it has written. */
  revision: number;
  load: (sketch: Sketch) => void;
  /** Applies an edit. With `record` false the change joins the last undo step, as during a drag. */
  change: (edit: (sketch: Sketch) => Sketch, record?: boolean) => void;
  /** Starts an undo step for a gesture whose changes follow with `record` false. */
  checkpoint: () => void;
  undo: () => void;
  redo: () => void;
}

/** The open sketch and its undo history. */
export const useSketchStore = create<SketchState>((set) => ({
  sketch: null,
  past: [],
  future: [],
  revision: 0,
  load: (sketch) => set({ sketch, past: [], future: [], revision: 0 }),
  change: (edit, record = true) =>
    set((state) => {
      if (!state.sketch) {
        return state;
      }
      const next = edit(state.sketch);
      if (next === state.sketch) {
        return state;
      }
      return {
        sketch: next,
        past: record ? [...state.past, state.sketch].slice(-HISTORY_LIMIT) : state.past,
        future: [],
        revision: state.revision + 1,
      };
    }),
  checkpoint: () =>
    set((state) =>
      state.sketch
        ? { past: [...state.past, state.sketch].slice(-HISTORY_LIMIT), future: [] }
        : state,
    ),
  undo: () =>
    set((state) => {
      const previous = state.past.at(-1);
      if (!previous || !state.sketch) {
        return state;
      }
      return {
        sketch: previous,
        past: state.past.slice(0, -1),
        future: [state.sketch, ...state.future],
        revision: state.revision + 1,
      };
    }),
  redo: () =>
    set((state) => {
      const next = state.future[0];
      if (!next || !state.sketch) {
        return state;
      }
      return {
        sketch: next,
        past: [...state.past, state.sketch],
        future: state.future.slice(1),
        revision: state.revision + 1,
      };
    }),
}));

const NO_KEYS: readonly MotionKey[] = [];
const NO_CELS: readonly EffectCel[] = [];

/** The open sketch's snapshots; the same empty list when none is open, so selectors stay stable. */
export const useMotionKeys = (): readonly MotionKey[] =>
  useSketchStore((state) => state.sketch?.motion.keys ?? NO_KEYS);

export const useEffectCels = (): readonly EffectCel[] =>
  useSketchStore((state) => state.sketch?.effect.cels ?? NO_CELS);
