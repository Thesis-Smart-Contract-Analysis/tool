import React from 'react';

import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CssBaseline from '@mui/material/CssBaseline';

import { Experimental_CssVarsProvider as CSSVarProvider } from '@mui/material/styles';
import App from './App.tsx';
import ResultProvider from './context/ResultContext.tsx';
import theme from './theme.ts';
import './index.scss';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ResultProvider>
      <CSSVarProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer
          style={{
            fontSize: '1.6rem',
          }}
        />
      </CSSVarProvider>
    </ResultProvider>
  </React.StrictMode>,
);
