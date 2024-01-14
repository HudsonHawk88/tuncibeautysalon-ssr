import React from "react";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
              <NavLink to="/" className="nav-link public-navbar__nav-link">
                {/* <i className="far fa-bookmark"></i> */}
                <i aria-hidden className="fas fa-home" />
                &nbsp; {lang === "hu" ? "Főoldal" : "Home"}
              </NavLink>
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
            <UncontrolledDropdown
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
                &nbsp; {lang === "hu" ? "Szolgáltatások" : "Dienstleistungen"}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <NavLink
                    className="nav-link public-navbar__nav-link"
                    to="/service/1"
                    end
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; {lang === "hu" ? "Kozmetika" : "Kosmetik"}
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink
                    className="nav-link public-navbar__nav-link"
                    to="/service/2"
                    end
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp;{" "}
                    {lang === "hu"
                      ? "Manikűr / Pedikűr"
                      : "Maniküre / Pediküre"}
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink
                    className="nav-link public-navbar__nav-link"
                    to="/service/3"
                    end
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp; {lang === "hu" ? "Smink" : "Make-Up"}
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink
                    className="nav-link public-navbar__nav-link"
                    to="/service/4"
                    end
                  >
                    <i aria-hidden className="fas fa-handshake"></i>
                    &nbsp;{" "}
                    {lang === "hu"
                      ? "Szempilla / Szemöldök"
                      : "Wimpern / Augenbrauen"}
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink
                    className="nav-link public-navbar__nav-link"
                    to="/preisliste"
                  >
                    <i className="fa-solid fa-money-bill" />
                    &nbsp; {lang === "hu" ? "Árlista" : "Preisliste"}
                  </NavLink>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            {/* <NavItem className="nav-item public-navbar__nav-item">
              <NavLink
                className="nav-link public-navbar__nav-link"
                to="/preisliste"
              >
                <i className="fa-solid fa-money-bill" />
                &nbsp; {lang === "hu" ? "Árlista" : "Preisliste"}
              </NavLink>
            </NavItem> */}
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
