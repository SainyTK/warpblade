import { HistoryButtons } from './HistoryButtons';
import { ModeTabs } from './ModeTabs';
import { SketchMenu } from './SketchMenu';

export function StudioHeader() {
  return (
    <header className="flex flex-wrap items-center gap-3 border-border border-b bg-card px-3 py-2">
      <h1 className="font-pixel text-primary text-sm tracking-wide">Warpblade Studio</h1>
      <SketchMenu />
      <ModeTabs />
      <div className="ml-auto">
        <HistoryButtons />
      </div>
    </header>
  );
}
