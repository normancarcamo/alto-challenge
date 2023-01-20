import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { hydrateLocalStorage } from "./utils/utils";

hydrateLocalStorage();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
