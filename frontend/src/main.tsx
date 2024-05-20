import React from "react";

import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import CssBaseline from "@mui/material/CssBaseline";

import App from "./App.tsx";
import "./i18n";
import "./index.scss";
import ResultProvider from "./context/ResultContext.tsx";
import { Experimental_CssVarsProvider as CSSVarProvider } from "@mui/material/styles";

import theme from "./theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ResultProvider>
      <CSSVarProvider theme={theme}>
        <CssBaseline />
        <App />
        <ToastContainer
          style={{
            fontSize: "1.6rem",
          }}
        />
      </CSSVarProvider>
    </ResultProvider>
  </React.StrictMode>
);
