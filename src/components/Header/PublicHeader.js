import React from "react";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  /*   UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, */
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { HU, CH } from "country-flag-icons/react/3x2";
import PropTypes from "prop-types";

const PublicHeader = (props) => {
  const { setLang, lang } = props;

  const toggleNavbar = (id) => {
    const collapse = document.getElementById(id);
    if (collapse) {
      collapse.classList.toggle("show");
    }
  };

  return (
    <React.Fragment>
      <div id="logo" />

      <Navbar expand="lg" light className="public-navbar" dark>
        <div
          className="navbar-toggler"
          onClick={() => toggleNavbar("public_navbar_collapse")}
        >
          <i aria-hidden className="fas fa-bars"></i>
        </div>
        <Collapse navbar id="public_navbar_collapse">
          <Nav navbar className="me-auto public-navbar__nav">
            <NavItem className="nav-item public-navbar__nav-item">
              <a className="nav-link public-navbar__nav-link" href="/">
                {/* <i className="far fa-bookmark"></i> */}
                <i aria-hidden className="fas fa-home" />
                &nbsp; {lang === "hu" ? "Főoldal" : "Home"}
              </a>
            </NavItem>
            <NavItem className="nav-item public-navbar__nav-item">
              <NavLink
                className="nav-link public-navbar__nav-link"
                to="/terminbuchen"
              >
                <i className="fa-solid fa-calendar-check" />
                &nbsp; {lang === "hu" ? "Időpontfoglaló" : "Termin buchen"}
              </NavLink>
            </NavItem>
            {/* <UncontrolledDropdown
              className="nav-item public-navbar__nav-item"
              inNavbar
              nav
            >
              <DropdownToggle
                nav
                caret
                className="nav-link public-navbar__nav-link"
              >
                <i aria-hidden className="fas fa-briefcase"></i>
                &nbsp; Dienstleistungen
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <NavLink
                    className="nav-link public-navbar__nav-link"
                    to="/kosmetik"
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; Kosmetic
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink
                    className="nav-link public-navbar__nav-link"
                    to="/manikure"
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; Maniküre
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink
                    className="nav-link public-navbar__nav-link"
                    to="/falschewimpern"
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; Falsche Wimpern
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink
                    className="nav-link public-navbar__nav-link"
                    to="/makeup"
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; Make-Up
                  </NavLink>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>*/}
            <NavItem className="nav-item public-navbar__nav-item">
              <NavLink
                className="nav-link public-navbar__nav-link"
                to="/dienstleistungen"
              >
                <i className="fa-regular fa-images" />
                &nbsp; {lang === "hu" ? "Szolgáltatások" : "Dienstleistungen"}
              </NavLink>
            </NavItem>
            <NavItem className="nav-item public-navbar__nav-item">
              <NavLink
                className="nav-link public-navbar__nav-link"
                to="/gallerie"
              >
                <i className="fa-regular fa-images" />
                &nbsp; {lang === "hu" ? "Galéria" : "Gallerie"}
              </NavLink>
            </NavItem>
            <NavItem className="nav-item public-navbar__nav-item">
              <NavLink
                className="nav-link public-navbar__nav-link"
                to="/kontakt"
              >
                <i aria-hidden className="fas fa-phone-alt"></i>
                &nbsp; {lang === "hu" ? "Kapcsolat" : "Kontakt"}
              </NavLink>
            </NavItem>
            <div>
              <CH
                width={50}
                height={30}
                style={{ cursor: "pointer" }}
                onMouseDown={() => {
                  setLang("ch");
                  toggleNavbar("public_navbar_collapse");
                }}
              />
              <HU
                width={50}
                height={30}
                style={{ cursor: "pointer" }}
                onMouseDown={() => {
                  setLang("hu");
                  toggleNavbar("public_navbar_collapse");
                }}
              />
            </div>
            {/*<NavItem className="nav-item public-navbar__nav-item">
              <NavLink className="nav-link public-navbar__nav-link" to="/ubermich">
                <i aria-hidden className="fas fa-info-circle"></i>
                &nbsp; Über mich
              </NavLink>
            </NavItem>*/}
          </Nav>
        </Collapse>
      </Navbar>
    </React.Fragment>
  );
};

PublicHeader.propTypes = {
  setLang: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

export default PublicHeader;
