import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import PublicHeader from "../components/Header/PublicHeader.js";
import PublicFooter from "../components/Footer/PublicFooter.js";
/* import PublicHeaderCarousel from "../components/Header/PublicHeaderCarousel"; */
import Loading from "../commons/Loading.js";

const Public = (props) => {
  const { children, isAdmin, accessibility } = props;
  const [loading] = useState(false);
  const location = useLocation();

  /*  console.log('PUBLICING: ', data); */

  return location.pathname === "/login" && !isAdmin ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <React.Fragment>
      <main
        className={`public_full ${
          /true/.test(accessibility) ? "accessibility" : ""
        }`}
      >
        <header>
          <PublicHeader {...props} />
        </header>
        {loading ? (
          <div
            className={`tartalom ${
              /true/.test(accessibility) ? "accessibility" : ""
            }`}
          >
            <Loading isLoading={loading} />
          </div>
        ) : (
          <div
            className={`tartalom ${
              /true/.test(accessibility) ? "accessibility" : ""
            }`}
          >
            {children}
          </div>
        )}
        <PublicFooter {...props} />
      </main>
    </React.Fragment>
  );
};

Public.propTypes = {
  accessibility: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

export default Public;
