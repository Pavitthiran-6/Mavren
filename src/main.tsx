// Debug Trick: Log all fetch calls
const originalFetch = window.fetch;
(window as any).fetch = async (...args: any[]) => {
  console.log("FETCH CALLED:", args[0]);
  return originalFetch(...args as [any, any]);
};

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
