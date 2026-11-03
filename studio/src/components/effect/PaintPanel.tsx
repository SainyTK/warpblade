import { PanelSection } from '../common/PanelSection';
import { CelControls } from './CelControls';
import { SwatchGrid } from './SwatchGrid';
import { ToolPicker } from './ToolPicker';

/** The effect tools: frames, drawing tools and the game's colors. */
export function PaintPanel() {
  return (
    <>
      <PanelSection title="Frame">
        <CelControls />
      </PanelSection>
      <PanelSection title="Tools">
        <ToolPicker />
      </PanelSection>
      <PanelSection title="Colors">
        <SwatchGrid />
      </PanelSection>
    </>
  );
}
