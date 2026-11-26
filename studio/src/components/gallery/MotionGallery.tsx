import { useOpenHero } from '@/hooks/useOpenHero';
import { MotionTile } from './MotionTile';

/** Every one of the open hero's motion clips, playing, in groups, or in one scrolling row on narrow screens. Pick one to edit it. */
export function MotionGallery() {
  const hero = useOpenHero();
  return (
    <nav
      aria-label={`${hero.name}'s motion`}
      className="compact:flex grid compact:gap-2 gap-4 compact:overflow-x-auto p-3"
    >
      {hero.groups.map((group) => (
        <section key={group.title} className="grid compact:contents gap-2">
          <h2 className="compact:hidden font-pixel text-[11px] text-muted-foreground uppercase tracking-wider">
            {group.title}
          </h2>
          <div className="grid compact:contents grid-cols-3 gap-2">
            {group.motions.map((motion) => (
              <MotionTile key={motion.id} motion={motion} />
            ))}
          </div>
        </section>
      ))}
    </nav>
  );
}
