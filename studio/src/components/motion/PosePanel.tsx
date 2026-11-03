import { PanelSection } from '../common/PanelSection';
import { JointFields } from './JointFields';
import { PoseToggles } from './PoseToggles';
import { SnapshotControls } from './SnapshotControls';
import { StartFrom } from './StartFrom';

/** The motion tools: snapshots, a starting clip or pose, and the pose as numbers. */
export function PosePanel() {
  return (
    <>
      <PanelSection title="Snapshot">
        <SnapshotControls />
      </PanelSection>
      <PanelSection title="Start from">
        <StartFrom />
      </PanelSection>
      <PanelSection title="Pose">
        <PoseToggles />
        <JointFields />
      </PanelSection>
    </>
  );
}
