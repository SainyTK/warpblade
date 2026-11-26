import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOpenHero } from '@/hooks/useOpenHero';
import { trainingUrl } from '@/utils/trainingUrl';

export function PlayButton() {
  const hero = useOpenHero();
  return (
    <Button
      variant="secondary"
      nativeButton={false}
      render={<a href={trainingUrl(hero.id)} target="_blank" rel="noopener" />}
    >
      <Play />
      Play
    </Button>
  );
}
