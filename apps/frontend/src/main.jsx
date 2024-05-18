import React from "react";
import ReactDOM from "react-dom/client";
import { DEFAULT_THEME, MantineProvider } from "@mantine/core";
import App from "./App.jsx";
import "./index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={DEFAULT_THEME}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
