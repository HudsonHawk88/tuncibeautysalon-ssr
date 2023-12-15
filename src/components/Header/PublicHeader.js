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
import { Link } from "react-router-dom";
import { HU, CH } from "country-flag-icons/react/3x2";
import PropTypes from "prop-types";

const PublicHeader = (props) => {
  const { setLang } = props;

  const toggleNavbar = (id) => {
    const collapse = document.getElementById(id);
    collapse.classList.toggle("show");
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
                &nbsp; Home
              </a>
            </NavItem>
            <NavItem className="nav-item public-navbar__nav-item">
              <Link
                className="nav-link public-navbar__nav-link"
                to="/terminbuchen"
                onClick={toggleNavbar}
              >
                <i className="fa-solid fa-calendar-check" />
                &nbsp; Termin buchen
              </Link>
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
                  <Link
                    className="nav-link public-navbar__nav-link"
                    to="/kosmetik"
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; Kosmetic
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link
                    className="nav-link public-navbar__nav-link"
                    to="/manikure"
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; Maniküre
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link
                    className="nav-link public-navbar__nav-link"
                    to="/falschewimpern"
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; Falsche Wimpern
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link
                    className="nav-link public-navbar__nav-link"
                    to="/makeup"
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; Make-Up
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>*/}
            <NavItem className="nav-item public-navbar__nav-item">
              <Link
                className="nav-link public-navbar__nav-link"
                to="/dienstleistungen"
                onClick={toggleNavbar}
              >
                <i className="fa-regular fa-images" />
                &nbsp; Dienstleistungen
              </Link>
            </NavItem>
            <NavItem className="nav-item public-navbar__nav-item">
              <Link
                className="nav-link public-navbar__nav-link"
                to="/gallerie"
                onClick={toggleNavbar}
              >
                <i className="fa-regular fa-images" />
                &nbsp; Gallerie
              </Link>
            </NavItem>
            <NavItem className="nav-item public-navbar__nav-item">
              <Link
                className="nav-link public-navbar__nav-link"
                to="/kontakt"
                onClick={toggleNavbar}
              >
                <i aria-hidden className="fas fa-phone-alt"></i>
                &nbsp; Kontakt
              </Link>
            </NavItem>
            <div>
              <CH
                width={50}
                height={30}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setLang("ch");
                  toggleNavbar();
                }}
              />
              <HU
                width={50}
                height={30}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setLang("hu");
                  toggleNavbar();
                }}
              />
            </div>
            {/*<NavItem className="nav-item public-navbar__nav-item">
              <Link className="nav-link public-navbar__nav-link" to="/ubermich">
                <i aria-hidden className="fas fa-info-circle"></i>
                &nbsp; Über mich
              </Link>
            </NavItem>*/}
          </Nav>
        </Collapse>
      </Navbar>
    </React.Fragment>
  );
};

PublicHeader.propTypes = {
  setLang: PropTypes.func.isRequired,
};

export default PublicHeader;
