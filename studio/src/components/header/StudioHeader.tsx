import { useOpenMotion } from '@/hooks/useOpenMotion';
import { CopyForClaude } from './CopyForClaude';
import { HeroPicker } from './HeroPicker';
import { HistoryButtons } from './HistoryButtons';
import { PlayButton } from './PlayButton';

export function StudioHeader() {
  const motion = useOpenMotion();
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-border border-b bg-card px-3 py-2">
      <h1 className="font-pixel text-primary text-sm tracking-wide">Warpblade Studio</h1>
      <HeroPicker />
      <p className="flex min-w-0 items-baseline gap-2">
        <span className="font-pixel text-sm">{motion.label}</span>
        <span className="truncate text-muted-foreground text-xs">{motion.clip}</span>
      </p>
      <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
        <HistoryButtons />
        <PlayButton />
        <CopyForClaude />
      </div>
    </header>
  );
}
