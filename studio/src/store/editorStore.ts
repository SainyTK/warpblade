import type { Pose } from '@game/types/pose';
import { create } from 'zustand';

interface EditorState {
  /** The playhead: the frame on the stage and the frame panel. */
  frame: number;
  playing: boolean;
  onion: boolean;
  grid: boolean;
  /** A pose copied from a frame, to paste on another. */
  copied: Pose | null;
  set: (change: Partial<Omit<EditorState, 'set'>>) => void;
  /** Stops playback and moves the playhead there. */
  seek: (frame: number) => void;
  togglePlay: () => void;
}

/** What the studio is showing. Nothing here is saved. */
export const useEditorStore = create<EditorState>((set) => ({
  frame: 0,
  playing: false,
  onion: true,
  grid: true,
  copied: null,
  set: (change) => set(change),
  seek: (frame) => set({ frame: Math.max(0, Math.round(frame)), playing: false }),
  togglePlay: () => set((state) => ({ playing: !state.playing })),
}));
