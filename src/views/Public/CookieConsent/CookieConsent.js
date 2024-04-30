import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import PropTypes from "prop-types";

const CookieConsent = (props) => {
  const { lang } = props;

  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const isHidden =
      !sessionStorage.getItem("cookieConsent") ||
      sessionStorage.getItem("cookieConsent") === "false"
        ? false
        : true;
    setIsHidden(isHidden);
  });

  const elfogad = () => {
    setIsHidden(true);
    sessionStorage.setItem("cookieConsent", "true");
  };

    return (
        __isBrowser__ && (
            window.location.pathname.startsWith("/datenverarbeitung") && !isHidden && !window.location.pathname.startsWith("/admin") ? (
                <div id="cookieConsent" className={window.location.pathname.startsWith("/datenverarbeitung") ? "also" : ""}>
                    <div className="tajekoztatoszoveg">
                        {lang === "hu"
                        ? "A weboldal sütiket (cookie-kat) használ, hogy biztonságos böngészés mellett a legjobb felhasználói élményt nyújtsa."
                        : "Die Website verwendet Cookies, um das beste Benutzererlebnis und sicheres Surfen zu bieten."}
                        &nbsp;
                        {lang === "hu" ? (
                        <a href="/datenverarbeitung" target="_blank">
                            {
                            "Részletes információ az adatkezelési nyilatkozatunkban olvasható."
                            }
                        </a>
                        ) : (
                        <a href="/datenverarbeitung" target="_blank">
                            {
                            "Detaillierte Informationen finden Sie in unserer Datenschutzerklärung."
                            }
                        </a>
                        )}
                    </div>
                    <Button onClick={elfogad}>
                        {lang === "hu" ? "Tudomásul vettem" : "Ich akzeptiere"}
                    </Button>
                </div>
            ) : (
                <div
                id="cookieConsentLayer"
                className={
                    isHidden || window.location.pathname.startsWith("/admin")
                    ? "hidden"
                    : ""
                }
                >
                    <div
                        id="cookieConsent"
                        className={
                        window.location.pathname.startsWith("/datenverarbeitung")
                            ? "also"
                            : ""
                        }
                    >
                        <div className="tajekoztatoszoveg">
                        {lang === "hu"
                            ? "A weboldal sütiket (cookie-kat) használ, hogy biztonságos böngészés mellett a legjobb felhasználói élményt nyújtsa."
                            : "Die Website verwendet Cookies, um das beste Benutzererlebnis und sicheres Surfen zu bieten."}
                        &nbsp;
                        {lang === "hu" ? (
                            <a href="/datenverarbeitung" target="_blank">
                            {
                                "Részletes információ az adatkezelési nyilatkozatunkban olvasható."
                            }
                            </a>
                        ) : (
                            <a href="/datenverarbeitung" target="_blank">
                            {
                                "Detaillierte Informationen finden Sie in unserer Datenschutzerklärung."
                            }
                            </a>
                        )}
                        </div>
                        <Button onClick={elfogad}>
                            {lang === "hu" ? "Tudomásul vettem" : "Ich akzeptiere"}
                        </Button>
                    </div>
                </div>
            )
        )  
    );
};

CookieConsent.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default CookieConsent;
