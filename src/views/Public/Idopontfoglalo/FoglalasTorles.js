import React, { Fragment, useEffect, useState } from "react";
import { Col, Row, Spinner } from "reactstrap";
import { useSearchParams } from 'react-router-dom'
import PropTypes from "prop-types";
import Services from "./Services";

const FoglalasTorles = (props) => {
  const { lang } = props;

  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  

  const redirect = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    const terminId = searchParams.get("terminId");
    if (terminId) {
      setLoading(true);
      Services.deleteFoglalas(terminId, (err) => {
        if (!err) {
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
    }
    window.setTimeout(redirect, 10000);
  }, []);

  return (
    <div style={{ width: "100%", display: 'flex', justifyContent: `${loading ? 'center': 'normal'}`, alignItems: `${loading ? 'center' : 'normal'}`, height: `${loading ? '100%' : 'unset'}` }}>
    {loading ? (
      <div style={{ textAlign: "center" }}>
        <Spinner color="danger" style={{ width: "6rem", height: "6rem" }}>
          {lang === 'hu' ? 'Fogalás törlése foylamatban...' : 'Reservierung stornieren...'}
        </Spinner>
        <div><h4>{lang === 'hu' ? 'Fogalás törlése foylamatban...' : 'Reservierung stornieren...'}</h4></div>
      </div>
    ) : (
      <Fragment>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h2>
              {lang === "hu" ? "Foglalás törlése sikeres!" : "Stornierung der Reservierung erfolgreich!"}
            </h2>
          </Col>
        </Row>
        <Row>
          {lang === "hu" ? (
            <Col xs={12} sm={12} md={12} lg={12}>
              A foglalását sikeresen törölte!<br />
              A törlésről e-mailben is értesítettük! <br />
              10 másodperc múlva visszairányítjük a főoldalra!
            </Col>
          ) : (
            <Col xs={12} sm={12} md={12} lg={12}>
              Sie haben Ihre Reservierung erfolgreich storniert! <br />
              Wir haben Sie auch per E-Mail über die Absage informiert!<br />
              Wir leiten Sie nach 10 Sekunden zur Hauptseite weiter!
            </Col>
          )}
        </Row>
      </Fragment>
    )}
    </div>
  );
};

FoglalasTorles.propTypes = {
  lang: PropTypes.string.isRequired,
  addNotification: PropTypes.func,
};

export default FoglalasTorles;
