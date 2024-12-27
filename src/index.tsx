import './index.css';

import { APIProvider } from '@vis.gl/react-google-maps';
import React, { FC } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ContentPage, ThemeProvider } from './components/Layout';
import { MapPage } from './pages';
import AboutContent from './pages/About.md';
import PrivacyContent from './pages/Privacy.md';
import { routes } from './pages/routes';

const App: FC = () => {
  return (
    <ThemeProvider>
      <APIProvider apiKey={MAPS_API_KEY || ''}>
        <BrowserRouter>
          <Routes>
            <Route path={routes.index} element={<MapPage />} />
            <Route path={routes.about} element={<ContentPage title="Про додаток" content={AboutContent} />} />
            <Route path={routes.privacy} element={<ContentPage title="Політика конфіденційності" content={PrivacyContent} />} />
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
