import React from 'react';

import ReactDOM from 'react-dom/client';

import CssBaseline from '@mui/material/CssBaseline';

import App from './App.tsx';
import './i18n';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);
