import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/600.css';
import '@fontsource/quicksand/700.css';
import './index.css';
import App from './App';
import { bridge } from './api/bridge';
import { BridgeProvider } from './api/BridgeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BridgeProvider value={bridge}>
      <App />
    </BridgeProvider>
  </StrictMode>,
);
