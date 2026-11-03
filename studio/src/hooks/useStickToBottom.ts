import { useCallback, useEffect, useRef, useState } from 'react';
import { STICK_TO_BOTTOM_PX } from '@/constants/agent';

/**
 * Keeps a scroll container pinned to its newest content while the owner is reading at the bottom,
 * and lets them scroll up without being pulled back. `atBottom` drives the jump-to-latest button.
 */
export function useStickToBottom(contentKey: unknown) {
  const container = useRef<HTMLDivElement | null>(null);
  const pinned = useRef(true);
  const [atBottom, setAtBottom] = useState(true);

  const onScroll = useCallback(() => {
    const element = container.current;
    if (!element) {
      return;
    }
    const near =
      element.scrollHeight - element.scrollTop - element.clientHeight < STICK_TO_BOTTOM_PX;
    pinned.current = near;
    setAtBottom(near);
  }, []);

  const scrollToBottom = useCallback((smooth = false) => {
    const element = container.current;
    if (!element) {
      return;
    }
    pinned.current = true;
    setAtBottom(true);
    element.scrollTo({ top: element.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  // Every change to the content, such as a streamed word, keeps a pinned view at the bottom.
  // biome-ignore lint/correctness/useExhaustiveDependencies: contentKey is the change signal.
  useEffect(() => {
    if (pinned.current) {
      const element = container.current;
      element?.scrollTo({ top: element.scrollHeight });
    }
  }, [contentKey]);

  return { container, onScroll, atBottom, scrollToBottom };
}
