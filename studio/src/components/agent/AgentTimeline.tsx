import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActiveJob } from '@/hooks/useActiveJob';
import { useStickToBottom } from '@/hooks/useStickToBottom';
import { AgentTimelineItem } from './AgentTimelineItem';
import { AgentWorking } from './AgentWorking';

/** The job's conversation. It scrolls on its own and follows new output while at the bottom. */
export function AgentTimeline() {
  const { view, busy } = useActiveJob();
  const items = view?.items ?? [];
  const last = items.at(-1);
  // Any new item or streamed word changes this key.
  const contentKey = `${items.length}:${last?.kind === 'text' || last?.kind === 'thinking' ? last.text.length : last?.id}:${view?.run?.status}`;
  const { container, onScroll, atBottom, scrollToBottom } = useStickToBottom(contentKey);
  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={container}
        onScroll={onScroll}
        // Relative, so visually hidden labels inside stay in this scroll area instead of stretching the page.
        className="relative h-full overflow-y-auto overscroll-contain"
        data-testid="agent-timeline"
      >
        <ol className="grid gap-3 px-3 pt-3 pb-6">
          {items.map((item) => (
            <li key={item.id} className="min-w-0">
              <AgentTimelineItem item={item} live={busy && item === last} />
            </li>
          ))}
          {busy && view?.run && (
            <li>
              <AgentWorking status={view.run.status} />
            </li>
          )}
        </ol>
      </div>
      {!atBottom && (
        <Button
          variant="outline"
          size="icon"
          aria-label="Jump to the latest message"
          onClick={() => scrollToBottom(true)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full shadow-card"
        >
          <ArrowDown />
        </Button>
      )}
    </div>
  );
}
