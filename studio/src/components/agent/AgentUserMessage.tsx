import type { UserItem } from '@shared/api';
import { AgentImage } from './AgentImage';

/** What the agent was asked: the studio's brief or a follow-up, with the sketch images above it. */
export function AgentUserMessage({ item }: { item: UserItem }) {
  return (
    <div className="flex flex-col items-end gap-2">
      {item.images.length > 0 && (
        <div className="flex max-w-[85%] flex-wrap justify-end gap-2">
          {item.images.map((image) => (
            <AgentImage key={image.src} image={image} variant="thumbnail" />
          ))}
        </div>
      )}
      {item.text && (
        <div
          dir="auto"
          className="max-h-80 max-w-[85%] overflow-y-auto whitespace-pre-wrap rounded-[20px] bg-muted px-4 py-2.5 text-[13px] leading-relaxed [overflow-wrap:anywhere]"
        >
          {item.text}
        </div>
      )}
    </div>
  );
}
