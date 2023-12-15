import React from "react";

const PublicFooter = () => {
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
        <br />
        <div className="linkek">
          <a href={"/adatkezeles"}>Adatkezelési nyilatkozat</a>
        </div>
        <div className="plus_nav">
          <div className="plus_content">
            <div className="kozossegi">
              <a
                href="https://www.facebook.com/myhomeberkimonika"
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
                href="https://www.tiktok.com/@myhomeingatlan"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="#" target="_blank" rel="noreferrer">
                <i aria-hidden className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
