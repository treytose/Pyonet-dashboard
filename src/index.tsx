import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import RouterProvider from "./components/Routes";
import { ThemeProvider } from "@mui/material/styles";
import { darkTheme } from "./themes/palette";
import CssBaseline from "@mui/material/CssBaseline";
import reportWebVitals from "./reportWebVitals";

import { AuthContextProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <AuthContextProvider>
        <CssBaseline />
        <RouterProvider />
        <div id="snackbar_container"></div>
      </AuthContextProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
