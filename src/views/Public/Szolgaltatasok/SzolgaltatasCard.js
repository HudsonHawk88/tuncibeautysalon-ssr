import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const SzolgaltatasCard = (props) => {
  const { data, groupId, lang } = props;
  const navigate = useNavigate();

  const getLeiras = (leiras) => {
    return leiras.length > 150 ? leiras.substring(0, 150) + "..." : leiras;
  };

  const szolgaltatasKat = {
    id: data.id,
    /* idotartam: data.idotartam + " " + (lang === "hu" ? "perc" : "minute"), */
    logo:
      data.kep && data.kep[0]
        ? data.kep[0].src
        : process.env.staticUrl + `/images/szolgaltataskepek/${groupId}.png`,
    katnev: lang === "hu" ? data.magyarkategorianev : data.kategorianev,
    katleiras:
      lang === "hu"
        ? getLeiras(data.magyarkategorialeiras)
        : getLeiras(data.kategorialeiras),
    /* ar:
      lang === "hu"
        ? data.magyarar + " " + data.magyarpenznem
        : data.ar + " " + data.penznem, */
  };

  const goToTerminBuch = () => {
    navigate(`terminbuchen`);
  };

  const goToService = (id) => {
    navigate(`service/${id}`);
  };

  const renderSzolgaltatas = () => {
    return (
      <div className="szolg_kartya" key={"SZOLGKAT_" + data.id}>
        <div className="szolg_container">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => goToService(data.id)}
          >
            <a href="">
              <div className="szolg_logo">
                <img src={szolgaltatasKat.logo} />
              </div>
              <div className="szolg_rovidnev">{szolgaltatasKat.katnev}</div>
              <div className="szolg_leiras">{szolgaltatasKat.katleiras}</div>
              {/* <div className="szolg_idotartam">{szolgaltatasKat.idotartam}</div> */}
              {/* <div className="szolg_ar">{szolgaltatasKat.ar}</div> */}
            </a>
          </div>
          <div className="idopont_button" onClick={() => goToTerminBuch()}>
            <a href="">{lang === "hu" ? "Időpontfoglalás" : "Termin buchen"}</a>
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
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default SzolgaltatasCard;
