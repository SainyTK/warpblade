import { Filmstrip } from './Filmstrip';
import { FrameTrack } from './FrameTrack';
import { Transport } from './Transport';

/** The bottom of the stage: playback, the filmstrip and the frame track. */
export function Timeline() {
  return (
    <div className="shrink-0 border-border border-t bg-card">
      <Transport />
      <Filmstrip />
      <FrameTrack />
    </div>
  );
}
