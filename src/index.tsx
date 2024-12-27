import './index.css';

import React, { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { routes } from './pages/routes';
import { AboutPage, MapPage, PrivacyPage } from './pages';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ThemeProvider } from './components/Layout';

const App: FC = () => {
  return (
    <ThemeProvider>
      <APIProvider apiKey={MAPS_API_KEY || ''}>
        <BrowserRouter>
          <Routes>
            <Route path={routes.index} element={<MapPage />} />
            <Route path={routes.about} element={<AboutPage />} />
            <Route path={routes.privacy} element={<PrivacyPage />} />
          </Routes>
        </BrowserRouter>
      </APIProvider>
    </ThemeProvider>
  );
};

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
