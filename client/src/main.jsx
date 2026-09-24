import React from "react";
import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./styles/global.css";

/*
  Always start from the top when the browser
  performs a full page refresh.
*/

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const navigationEntry = performance.getEntriesByType("navigation")[0];

if (navigationEntry?.type === "reload") {
  window.history.replaceState({}, "", "/");

  window.scrollTo(0, 0);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
