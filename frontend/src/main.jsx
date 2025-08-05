import './i18n';
import React from 'react';
import App from './App.jsx';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { UserProvider } from './context/User/UserProvider.jsx';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';

export function Main() {
  return (
    <StrictMode>
      <UserProvider>
        <BrowserRouter>
          <MantineProvider defaultColorScheme="light">
            <Notifications />
            <App />
          </MantineProvider>
        </BrowserRouter>
      </UserProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Main />);
