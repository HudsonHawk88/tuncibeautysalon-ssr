import React from "react";
import PropTypes from "prop-types";

const SzolgaltatasCard = (props) => {
  const { data, lang } = props;

  const renderSzolgaltatas = () => {
      <div className="szolg_kartya">
        <div className="szolg_container">
          <div className="szolg_logo"></div>
          <div className="szolg_leiras"></div>
          <div className="idopont_button">
            {lang === 'hu' ? 'Időpotfoglalás' : 'Termin buchen'}
          </div>
        </div>
      </div>
  };

  return <div>{renderSzolgaltatas()}</div>;
};

SzolgaltatasCard.propTypes = {
  data: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
};

export default SzolgaltatasCard;
