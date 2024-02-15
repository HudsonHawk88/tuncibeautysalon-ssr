import React from "react";
import PropTypes from "prop-types";

const PublicFooter = (props) => {
  const { lang } = props;
  return (
    <footer className="public-footer" id="public_footer">
      <div className="public-footer__div">
        <div className="copyright">
          {`Designed and created by`}&nbsp;
          <a
            id="inftechsol_link"
            href="https://inftechsol.hu"
            target="_blank"
            rel="noreferrer"
          >
            Inftechsol
          </a>{" "}
          <sup>
            <i aria-hidden className="far fa-copyright"></i>
          </sup>
        </div>
        <div className="linkek">
          <a href={"/datenverarbeitung"}>
            {lang === "hu"
              ? "Adatkezelési nyilatkozat"
              : "Erklärung zur Datenverwaltung"}
          </a>
        </div>
        <div className="plus_nav">
          <div className="plus_content">
            <div className="kozossegi">
              <a
                href="https://www.facebook.com/profile.php?id=61555853729992"
                target="_blank"
                rel="noreferrer"
              >
                <i aria-hidden className="fab fa-facebook-square"></i>
              </a>
              <a
                href="https://www.instagram.com/myhomeingatlan/"
                target="_blank"
                rel="noreferrer"
              >
                <i aria-hidden className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.tiktok.com/@tnci58?_t=8iq2E1QsvGD&_r=1"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-tiktok"></i>
              </a>
              {/*<a href="#" target="_blank" rel="noreferrer">
                <i aria-hidden className="fab fa-whatsapp"></i>
              </a>*/}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

PublicFooter.propTypes = {
  lang: PropTypes.string.isRequired,
};

export default PublicFooter;
