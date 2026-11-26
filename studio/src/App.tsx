import { TooltipProvider } from '@/components/ui/tooltip';
import { StudioPage } from '@/pages/StudioPage';

export function App() {
  return (
    <TooltipProvider>
      <StudioPage />
    </TooltipProvider>
  );
}
