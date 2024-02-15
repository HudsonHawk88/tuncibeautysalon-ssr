import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Services from "./Services.js";

const Adatkezeles = (props) => {
  const defaultAdatkezeles = {
    azonosito: "",
    tipus: "",
    leiras: "",
  };
  const [adatkezeles, setAdatkezeles] = useState(defaultAdatkezeles);
  const { lang } = props;

  const getAdatkezeles = () => {
    Services.listAdatkezeles((err, res) => {
      if (!err) {
        setAdatkezeles({
          azonosito: res[0].azonosito,
          tipus: res[0].tipus,
          leiras: res[0].leiras,
          magyarleiras: res[0].magyarleiras,
        });
      }
    });
  };

  const init = () => {
    getAdatkezeles();
  };

  useEffect(() => {
    init();
  }, []);

  const renderAdatkezeles = () => {
    return (
      <React.Fragment>
        <div
          className="adatkezeles__leiras"
          dangerouslySetInnerHTML={{
            __html:
              lang === "hu" ? adatkezeles.magyarleiras : adatkezeles.leiras,
          }}
        />
      </React.Fragment>
    );
  };

  return <div className="adatkezeles">{renderAdatkezeles()}</div>;
};

Adatkezeles.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Adatkezeles;
