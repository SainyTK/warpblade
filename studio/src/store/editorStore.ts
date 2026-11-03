import type { Color } from '@game/types/color';
import type { Pose } from '@game/types/pose';
import { create } from 'zustand';
import { DEFAULT_SNAPSHOT_GAP } from '@/constants/stage';
import { DEFAULT_COLOR } from '@/constants/swatches';
import type { EditorMode, PaintTool } from '@/types/studio';

/** A pose being made at a frame with no snapshot yet. Taking a snapshot keeps it. */
export interface Draft {
  frame: number;
  pose: Pose;
  root: { x: number; y: number };
}

interface EditorState {
  mode: EditorMode;
  /** The playhead: the frame on the stage and the timeline. */
  frame: number;
  playing: boolean;
  /** While playing, the frame playback started from; the tool panels stay on it until playback stops. */
  heldFrame: number | null;
  draft: Draft | null;
  snapshotGap: number;
  onion: boolean;
  grid: boolean;
  /** Kael behind the effect drawing. */
  underlay: boolean;
  tool: PaintTool;
  color: Color;
  brush: number;
  /** The agent job open in the side panel. */
  jobId: string | null;
  set: (change: Partial<Omit<EditorState, 'set'>>) => void;
  /** Stops playback and moves the playhead there; a draft at another frame is dropped. */
  seek: (frame: number) => void;
  play: () => void;
  /** Stops playback where it is; the tool panels move to that frame. */
  pause: () => void;
  togglePlay: () => void;
}

/** What the studio is showing and the tools in hand. Nothing here is saved with the sketch. */
export const useEditorStore = create<EditorState>((set, get) => ({
  mode: 'motion',
  frame: 0,
  playing: false,
  heldFrame: null,
  draft: null,
  snapshotGap: DEFAULT_SNAPSHOT_GAP,
  onion: true,
  grid: true,
  underlay: true,
  tool: 'pencil',
  color: DEFAULT_COLOR,
  brush: 1,
  jobId: null,
  set: (change) => set(change),
  seek: (frame) =>
    set((state) => ({
      frame: Math.max(0, Math.round(frame)),
      playing: false,
      heldFrame: null,
      draft: state.draft && state.draft.frame === Math.round(frame) ? state.draft : null,
    })),
  play: () => set((state) => ({ playing: true, heldFrame: state.frame })),
  pause: () => set({ playing: false, heldFrame: null }),
  togglePlay: () => (get().playing ? get().pause() : get().play()),
}));
