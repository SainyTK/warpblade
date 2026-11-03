import { TooltipProvider } from '@/components/ui/tooltip';
import { StudioPage } from '@/pages/StudioPage';
import { MediaViewerProvider } from '@/providers/MediaViewerProvider';
import { SettingsProvider } from '@/providers/SettingsProvider';
import { SketchLibraryProvider } from '@/providers/SketchLibraryProvider';

export function App() {
  return (
    <TooltipProvider>
      <SettingsProvider>
        <SketchLibraryProvider>
          <MediaViewerProvider>
            <StudioPage />
          </MediaViewerProvider>
        </SketchLibraryProvider>
      </SettingsProvider>
    </TooltipProvider>
  );
}
