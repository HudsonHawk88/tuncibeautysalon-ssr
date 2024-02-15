import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import Services from "./Services.js";

const Kapcsolat = (props) => {
  const { lang } = props;

  const [kapcsolat, setKapcsolat] = useState([]);

  const getKapcsolat = () => {
    Services.listKapcsolat((err, res) => {
      if (!err) {
        setKapcsolat(res[0]);
      }
    });
  };

  const init = () => {
    getKapcsolat();
  };

  useEffect(() => {
    init();
  }, []);

  const renderKapcsolatHelyseg = (helyseg) => {
    return `${lang === "hu" ? "Cím: " : "Adress: "} ${
      helyseg.orszag ? helyseg.orszag.orszagnev : ""
    } ${helyseg.irszam}, ${helyseg.telepules} ${helyseg.cim}`;
  };

  const renderKapcsolatNyitvatartas = (nyitvatartas) => {
    let nyitKeys = Object.keys(nyitvatartas);
    nyitKeys = nyitKeys.filter((ny) => !ny.startsWith("is"));

    const newKeys = [];

    nyitKeys.forEach((ny) => {
      if (ny === "monday") {
        newKeys[0] = ny;
      } else if (ny === "tuesday") {
        newKeys[1] = ny;
      } else if (ny === "wednesday") {
        newKeys[2] = ny;
      } else if (ny === "thursday") {
        newKeys[3] = ny;
      } else if (ny === "friday") {
        newKeys[4] = ny;
      } else if (ny === "saturday") {
        newKeys[5] = ny;
      } else if (ny === "sunday") {
        newKeys[6] = ny;
      }
    });

    const getDay = (day) => {
      switch (day) {
        case "monday": {
          return lang === "hu" ? "Hétfő" : "Montag";
        }
        case "tuesday": {
          return lang === "hu" ? "Kedd" : "Dienstag";
        }
        case "wednesday": {
          return lang === "hu" ? "Szerda" : "Mittwoch";
        }
        case "thursday": {
          return lang === "hu" ? "Csütörtök" : "Donnerstag";
        }
        case "friday": {
          return lang === "hu" ? "Péntek" : "Freitag";
        }
        case "saturday": {
          return lang === "hu" ? "Szombat" : "Samstag";
        }
        case "sunday": {
          return lang === "hu" ? "Vasárnap" : "Sonntag";
        }
      }
    };

    return newKeys.map((nyit) => {
      let day = `${getDay(nyit)}: ${nyitvatartas[nyit].tol} - ${
        nyitvatartas[nyit].ig
      }`;
      const isKey = `is${
        nyit.charAt(0).toUpperCase() + nyit.substring(1, nyit.length)
      }`;
      console.log(nyitvatartas[nyit]);
      const isNyitva = nyitvatartas[isKey];
      if (!isNyitva) {
        day = `${getDay(nyit)}: ${
          lang === "hu" ? "Nincs nyitva" : "Es ist nicht geöffnet"
        }`;
      }
      return (
        <div key={nyit} className="openDay">
          {day}
        </div>
      );
    });
  };

  const renderKapcsolat = () => {
    return (
      kapcsolat && (
        <Fragment>
          <div className="nev">
            <h3 style={{ textAlign: "center" }}>{kapcsolat.cegnev || ""}</h3>
          </div>
          <br />
          <div className="cim" style={{ textAlign: "center" }}>
            {kapcsolat.helyseg ? renderKapcsolatHelyseg(kapcsolat.helyseg) : ""}
          </div>
          <br />
          <div className="telefon" style={{ textAlign: "center" }}>
            {(lang === "hu" ? "Tel.: " : "Tel.: ") + kapcsolat.telefon}
          </div>
          <br />
          <div className="email" style={{ textAlign: "center" }}>
            {(lang === "hu" ? "E-mail: " : "E-mail: ") + kapcsolat.email}
          </div>
          <br />
          <div className="web" style={{ textAlign: "center" }}>
            {(lang === "hu" ? "Web: " : "Web: ") + kapcsolat.web}
          </div>
          <br />
          <div className="nyitvatartas" style={{ textAlign: "center" }}>
            {kapcsolat.nyitvatartas
              ? renderKapcsolatNyitvatartas(kapcsolat.nyitvatartas)
              : ""}
          </div>
        </Fragment>
      )
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="row">
        <div className="col-md-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2720.1973884781146!2d7.4800742763598125!3d47.016730371141776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478e3a828e8621c9%3A0xc6bc0cbce711a227!2sKirchgasse%203%2C%203302%20Moosseedorf%2C%20Sv%C3%A1jc!5e0!3m2!1shu!2shu!4v1705273684948!5m2!1shu!2shu"
            width="100%"
            height="450px"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
          />
        </div>
        <div className="col-md-6" style={{ margin: "auto" }}>
          {renderKapcsolat()}
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col-md-12">
          {lang === "hu"
            ? "A parkoló a másik helyen van!"
            : "Der Parkplatz ist an der anderen Stelle!"}
        </div>
      </div>
    </div>
  );
};

Kapcsolat.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default Kapcsolat;
