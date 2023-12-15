import React, { useEffect, useState, useCallback } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import "react-responsive-carousel/lib/styles/carousel.min.css";
/* import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css'; */
import Services from "./views/Pages/Login/Services";
import Pubroutes from "./routes/Publicroutes";
import AdmRoutes from "./routes/Adminroutes";
/* import Login from "./views/Pages/Login"; */
import { hasRole } from "./commons/Lib";
import { useLocation } from "react-router-dom";
import "react-widgets/styles.css";

const createNotification = (type, msg) => {
  switch (type) {
    case "info":
      NotificationManager.info(msg);
      break;
    case "success":
      NotificationManager.success(msg);
      break;
    case "warning":
      NotificationManager.warning(msg);
      break;
    case "error":
      NotificationManager.error(msg);
      break;
    default:
      NotificationManager.info(msg);
  }
};

function App() {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("ch");
  let location = useLocation();

  const isAdmin = __isBrowser__ && location.pathname.startsWith("/admin");

  useEffect(() => {
    const token = localStorage ? localStorage.getItem("refreshToken") : "";
    if (token && isAdmin) {
      setInterval(() => {
        refreshToken(token);
      }, 1000 * 60);
    }
  }, [isAdmin]);

  const refreshToken = () => {
    const token = localStorage ? localStorage.getItem("refreshToken") : "";
    Services.refreshToken(token, isAdmin, (err, res) => {
      if (!err) {
        setUser(res.user);
      } else {
        localStorage.removeItem("refreshToken");
        setTimeout(() => {
          logout("redirect");
        }, 5000);
      }
    });
  };

  const logout = (command) => {
    const token = localStorage ? localStorage.getItem("refreshToken") : "";
    Services.logout(token, isAdmin, (err) => {
      if (!err) {
        localStorage.removeItem("refreshToken");
        if (__isBrowser__) {
          if (command && command === "redirect") {
            window.location.reload();
          } else {
            window.location.href = "/";
          }
        }
      }
    });
  };

  useEffect(() => {
    const token = localStorage ? localStorage.getItem("refreshToken") : "";
    if (isAdmin) {
      if (token) {
        refreshToken();
      }
    }
  }, [isAdmin]);

  const onBackButtonEvent = useCallback((e) => {
    e.preventDefault();
    /* const currentLocation = window.location.pathname; */

    /* console.log(currentLocation, e.state); */
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, [onBackButtonEvent]);

  useEffect(() => {
    if (__isBrowser__) {
      setLang(process.env.lang);
      if (
        (location && location.pathname.startsWith("/admin")) ||
        window.location.pathname === "/login"
      ) {
        refreshToken();
      }
    }
  }, [location, __isBrowser__]);

  /*   const scrollToTop = () => {
    window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
    });
} */

  /* console.log(global.window.location.href) */
  /* console.log(window) */

  /*   useEffect(() => {
        scrollToTop();

        return () => {
          
        }
  }, [location]); */

  /*   const getInitialDatas = () => {
    if (__isBrowser__) {
      setData(window.__INITIAL_DATA__);
    } else {
      setData(props.staticContext.data);
    }
  } */

  /*   useEffect(() => {
    getInitialDatas();
  }, [__isBrowser__]) */

  /*   console.log('APP INGATLANOK: ', initialData); */

  return (
    <React.Fragment>
      <NotificationContainer />
      {isAdmin && user ? (
        <AdmRoutes
          reCaptchaKey={process.env.reachaptchaApiKey}
          hasRole={hasRole}
          addNotification={createNotification}
          user={user}
          logout={logout}
          lang={lang}
          setLang={setLang}
        />
      ) : (
        <React.Fragment>
          <Pubroutes
            mainUrl={process.env.mainUrl}
            isAdmin={isAdmin}
            setUser={setUser}
            reCaptchaKey={process.env.reachaptchaApiKey}
            addNotification={createNotification}
            lang={lang}
            setLang={setLang}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export { App, createNotification };
