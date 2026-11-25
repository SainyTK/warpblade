import '@game/game/hero/kits';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { installHeroArt } from './services/heroArt';

const root = document.getElementById('root');
if (!root) {
  throw new Error('The page has no #root element.');
}
await installHeroArt();
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
