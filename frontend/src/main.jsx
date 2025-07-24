import React from 'react';
import App from './App.jsx';
import {StrictMode, useState} from 'react'
import {BrowserRouter} from 'react-router-dom';
import {createRoot} from 'react-dom/client'
import {MantineProvider} from '@mantine/core';
import {ConfigProvider} from './context/Config/index.jsx';
import {UserProvider} from './context/User/index.jsx';
import {Notifications} from '@mantine/notifications';
import '@mantine/core/styles.css'

function Main() {
  return (
      <StrictMode>
        <ConfigProvider>
          <UserProvider>
            <BrowserRouter>
              <MantineProvider defaultColorScheme="light">
                <Notifications/>
                <App/>
              </MantineProvider>
            </BrowserRouter>
          </UserProvider>
        </ConfigProvider>
      </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Main/>);