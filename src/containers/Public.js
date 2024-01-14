import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import PublicHeader from "../components/Header/PublicHeader";
import PublicFooter from "../components/Footer/PublicFooter";
/* import PublicHeaderCarousel from "../components/Header/PublicHeaderCarousel"; */
import Loading from "../commons/Loading";

const Public = (props) => {
  const { children, isAdmin } = props;
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  /*  console.log('PUBLICING: ', data); */

  return location.pathname === "/login" && !isAdmin ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <React.Fragment>
      <div className="public_full">
        <header>
          <PublicHeader {...props} />
        </header>
        {loading ? (
          <div className="tartalom">
            <Loading isLoading={loading} />
          </div>
        ) : (
          <div className="tartalom">{children}</div>
        )}
        <PublicFooter />
      </div>
    </React.Fragment>
  );
};

export default Public;
