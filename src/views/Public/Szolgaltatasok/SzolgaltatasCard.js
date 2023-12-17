import React, { Fragment } from "react";
import PropTypes from "prop-types";

const SzolgaltatasCard = (props) => {
  const { data, lang } = props;

  const szolgaltatas = {
    logo: process.env.staticUrl + `/images/szolg${data.idx}.jpg`,
    rovidnev: lang === 'hu' ? data.magyarszolgrovidnev : data.szolgrovidnev,
    leiras: lang === 'hu' ? data.magyarszolgreszletek : data.szolgreszletek,
    ar: lang === 'hu' ? data.magyarar + ' ' + data.magyarpenznem : data.ar + ' ' + data.penznem,
  }

  console.log('DATA: ', data);

  const renderSzolgaltatas = () => {
    return (
      <div className="szolg_kartya">
        <div className="szolg_container">
          <div className="szolg_logo"><img src={szolgaltatas.logo} /></div>
          <div className="szolg_rovidnev">{szolgaltatas.rovidnev}</div>
          <div className="szolg_leiras">{szolgaltatas.leiras}</div>
          <div className="szolg_ar">{szolgaltatas.ar}</div>
          <div className="idopont_button">
            {lang === 'hu' ? 'Időpotfoglalás' : 'Termin buchen'}
          </div>
        </div>
      </div>
    );
  };

  return <Fragment>{renderSzolgaltatas()}</Fragment>;
};

SzolgaltatasCard.propTypes = {
  data: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

export default SzolgaltatasCard;
