import { useEditorStore } from '@/store/editorStore';
import { PanelSection } from '../common/PanelSection';
import { ClipActions } from './ClipActions';
import { FrameActions } from './FrameActions';
import { JointFields } from './JointFields';
import { PoseToggles } from './PoseToggles';

/** The frame at the playhead: its marks and actions, then its pose. */
export function FramePanel() {
  const frame = useEditorStore((state) => state.frame);
  return (
    <>
      <PanelSection title={`Frame ${frame}`}>
        <FrameActions />
      </PanelSection>
      <PanelSection title="Pose">
        <PoseToggles />
        <JointFields />
      </PanelSection>
      <PanelSection title="Clip">
        <ClipActions />
      </PanelSection>
    </>
  );
}
