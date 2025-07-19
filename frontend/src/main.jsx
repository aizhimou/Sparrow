import React from 'react';
import App from './App.jsx';
import {StrictMode, useState} from 'react'
import {BrowserRouter} from 'react-router-dom';
import {createRoot} from 'react-dom/client'
import {MantineProvider} from '@mantine/core';
import {StatusProvider} from './context/Status/index.jsx';
import {UserProvider} from './context/User/index.jsx';
import {Notifications} from '@mantine/notifications';
import '@mantine/core/styles.css'
import {getTheme, setTheme} from "./helpers/index.js";

function Main() {
  const [colorScheme, setColorScheme] = useState(getTheme);
  const [isDark, setIsDark] = useState(false);
  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    let newTheme = colorScheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsDark((prev) => !prev)
  }
  return (
      <StrictMode>
        <StatusProvider>
          <UserProvider>
            <BrowserRouter>
              <MantineProvider forceColorScheme={colorScheme}>
                <Notifications/>
                <App isDark={isDark} toggleColorScheme={toggleColorScheme}/>
              </MantineProvider>
            </BrowserRouter>
          </UserProvider>
        </StatusProvider>
      </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Main/>);