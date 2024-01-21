import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";
import PropTypes from "prop-types";

const SikeresFoglalas = (props) => {
  const { lang } = props;

  const redirect = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    window.setTimeout(redirect, 10000);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12}>
          <h2>
            {lang === "hu" ? "Sikeres foglalás" : "Erfolgreiche Buchung!"}
          </h2>
        </Col>
      </Row>
      <Row>
        {lang === "hu" ? (
          <Col xs={12} sm={12} md={12} lg={12}>
            A foglalás adatait elküldtük e-mailben! Lemondani az e-mail-ben
            található linken keresztül tudja! <br />
            Fontos, hogy lemondani legkésőbb 2 nappal az időpont napját
            megelőzően lehet. Amennyiben mégis lemondja, úgy 3 határidőn túli
            foglalás törlés után ideiglenesen nem fogja tudni használni az
            időpontfoglalót! <br />
            Kérjük szíves megértését! <br />
            10 másodperc múlva visszairányítjük a főoldalra!
          </Col>
        ) : (
          <Col xs={12} sm={12} md={12} lg={12}>
            Wir haben Ihnen die Reservierungsdetails per E-Mail zugesandt! Über
            den Link in der E-Mail können Sie kündigen! <br />
            Wichtig ist, dass Sie spätestens 2 Tage vor dem Termin absagen
            können. Wenn Sie stornieren, können Sie den Terminkalender nach der
            Stornierung von 3 verspäteten Buchungen vorübergehend nicht nutzen!{" "}
            <br />
            Bitte verstehe! <br />
            Wir leiten Sie nach 10 Sekunden zur Hauptseite weiter!
          </Col>
        )}
      </Row>
    </div>
  );
};

SikeresFoglalas.propTypes = {
  lang: PropTypes.string.isRequired,
  addNotification: PropTypes.func,
};

export default SikeresFoglalas;
