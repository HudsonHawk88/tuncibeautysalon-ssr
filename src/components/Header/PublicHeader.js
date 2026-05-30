import React, {useEffect} from "react";
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
import Services from "../../views/Public/Szolgaltatasok/Services"

const PublicHeader = (props) => {
  const { setLang, lang, accessibility, toggleAccessibility } = props;
  const [szolgKategoriak, setSzolgKategoriak] = React.useState([]);

  const toggleNavbar = (id) => {
    const collapse = document.getElementById(id);
    if (collapse) {
      collapse.classList.toggle("show");
    }
  };

  const getSzolgaltatasKategoriak = () => {
    Services.getSzolgaltatasKategoriak((err, res) => {
      if (!err) {
        setSzolgKategoriak(res);
      }
    });
  }

  useEffect(() => {
    getSzolgaltatasKategoriak()
  }, [])

  return (
    <React.Fragment>
      <h1>
        <img id="logo" alt="logo" />
      </h1>

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
                {szolgKategoriak && szolgKategoriak.length && szolgKategoriak.map(szolgkat => {
                  const to = "/service/" + szolgkat.id;
                  return (
                      <DropdownItem>
                        <NavLink
                            className="nav-link public-navbar__nav-link"
                            to={to}
                            end
                        >
                          <i aria-hidden className="fas fa-handshake"></i>
                          &nbsp; {lang === "hu" ? szolgkat.magyarkategorianev : szolgkat.kategorianev}
                        </NavLink>
                      </DropdownItem>
                  )
                })}
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
            <NavItem className="nav-item public-navbar__nav-item">
              <NavLink
                className="nav-link public-navbar__nav-link"
                to="/galerie"
              >
                <i className="fa-regular fa-images" />
                &nbsp; {lang === "hu" ? "Galéria" : "Galerie"}
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
            <li>
              <a
                href=""
                rel="noreferrer"
                onClick={() => {
                  const currAcc = /true/.test(accessibility);
                  toggleAccessibility((!currAcc).toString());
                  toggleNavbar("public_navbar_collapse");
                }}
              >
                <i
                  className={`fa-brands fa-accessible-icon ${
                    /true/.test(accessibility) ? "active" : ""
                  }`}
                />
              </a>
            </li>
            <li>
              <a href="">
                <CH
                  width={50}
                  height={30}
                  style={{ cursor: "pointer" }}
                  onMouseDown={() => {
                    setLang("ch");
                    toggleNavbar("public_navbar_collapse");
                  }}
                />
              </a>
              <a href="">
                <HU
                  width={50}
                  height={30}
                  style={{ cursor: "pointer" }}
                  onMouseDown={() => {
                    setLang("hu");
                    toggleNavbar("public_navbar_collapse");
                  }}
                />
              </a>
            </li>
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
  accessibility: PropTypes.string.isRequired,
  toggleAccessibility: PropTypes.func.isRequired,
  setLang: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
};

export default PublicHeader;
