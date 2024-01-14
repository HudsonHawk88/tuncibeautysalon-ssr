import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

import Services from "./Services";

const Szolgaltatas = (props) => {
  const { lang } = props;

  const { id } = useParams();
  const [kategoria, setKategoria] = useState(null);

  const translateKategoria = (kateg) => {
    const newKat = Object.assign(kateg, {
      katnev: lang === "hu" ? kateg.magyarkategorianev : kateg.kategorianev,
      katleiras:
        lang === "hu" ? kateg.magyarkategorialeiras : kateg.kategorialeiras,
      logo: process.env.staticUrl + `/images/szolgaltataskepek/${kateg.id}.jpg`,
    });
    setKategoria(newKat);
  };

  const getKategoria = (szolgId) => {
    Services.getSzolgaltatasKategoria(szolgId, (err, res) => {
      if (!err) {
        const kat = res[0];
        console.log(kat);
        if (kat) {
          translateKategoria(kat);
        }
      }
    });
  };

  useEffect(() => {
    console.log(id);
    if (id) {
      getKategoria(id);
    }
  }, [lang, id]);

  const renderKategoria = () => {
    return (
      <div className="szolgkat">
        <div className="szolgkat_logo">
          <img src={kategoria.logo} />
        </div>
        <h2>{kategoria.katnev}</h2>
        <div className="szolgkat_leiras">{kategoria.katleiras}</div>
      </div>
    );
  };

  return <div>{kategoria && renderKategoria()}</div>;
};

Szolgaltatas.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Szolgaltatas;
