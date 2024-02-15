import React, { StrictMode } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
/* import { initFacebookSdk } from './commons/InitFacebookSDK'; */

import { App } from "./App.js";

const history = createBrowserHistory();
const container = document.getElementById("root");
const isBrowser = __isBrowser__;

function startApp() {
  if (isBrowser) {
    const root = createRoot(container);
    root.render(
      /* <StrictMode> */
      <Router>
        <App history={history} />
      </Router>
      /*   </StrictMode> */
    );
  } else {
    const root = hydrateRoot(
      container,
      /* <StrictMode> */
      <Router>
        <App history={history} />
      </Router>
      /* </StrictMode> */
    );
  }
}

startApp();

/* initFacebookSdk().then(startApp); */
