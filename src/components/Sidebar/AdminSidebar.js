import React from "react";
import { Navbar, Collapse, Nav, NavItem } from "reactstrap";
import NavLink from "../../commons/NavLink.js";
import PropTypes from "prop-types";

const AdminSidebar = (props) => {
  const { user, hasRole } = props;

  const toggleSidebar = (side, coll) => {
    const sidebar = document.getElementById(side);
    const collapse = document.getElementById(coll);
    if (sidebar && collapse) {
      sidebar.classList.toggle("show");
      collapse.classList.toggle("show");
    }
  };

  return (
    <div className="admin_nav">
      <div
        className="admin-sidebar__toggler navbar-toggler"
        onClick={() => toggleSidebar("admin_sidebar", "admin_collapse")}
      >
        <i className="fas fa-bars"></i>
      </div>
      <Navbar dark id="admin_sidebar" className="admin-sidebar show">
        <Collapse navbar className="admin_collapse show" id="admin_collapse">
          <Nav className="me-auto" navbar id="admin_nav">
            <NavItem className="admin-sidebar__navitem">
              <NavLink
                className="admin-sidebar__navlink nav-link"
                to="/admin"
                id="home"
                end={"true"}
              >
                &nbsp;&nbsp;
                <i className="fas fa-home" />
                &nbsp; Főoldal
              </NavLink>
            </NavItem>
            {hasRole(user.roles, ["SZUPER_ADMIN"]) && (
              <React.Fragment>
                <NavItem className="admin-sidebar__navitem">
                  <NavLink
                    className="admin-sidebar__navlink nav-link"
                    to="/admin/felhasznalok"
                    id="felhasznalok"
                  >
                    &nbsp;&nbsp;<i aria-hidden className="fas fa-user"></i>
                    &nbsp;&nbsp; Admin felhasználók
                  </NavLink>
                </NavItem>
                <NavItem className="admin-sidebar__navitem">
                  <NavLink
                    className="admin-sidebar__navlink nav-link"
                    to="/admin/jogosultsagok"
                    id="jogosultsagok"
                  >
                    &nbsp;&nbsp;
                    <i aria-hidden className="fas fa-user" />
                    &nbsp;&nbsp; Jogosultságok
                  </NavLink>
                </NavItem>
              </React.Fragment>
            )}
            {hasRole(user.roles, ["SZUPER_ADMIN"]) && (
              <NavItem className="admin-sidebar__navitem">
                <NavLink
                  className="admin-sidebar__navlink nav-link"
                  to="/admin/bio"
                  id="bio"
                >
                  &nbsp;&nbsp;<i aria-hidden className="fas fa-user"></i>
                  &nbsp;&nbsp; Bio
                </NavLink>
              </NavItem>
            )}
            {hasRole(user.roles, ["SZUPER_ADMIN"]) && (
              <NavItem className="admin-sidebar__navitem">
                <NavLink
                  className="admin-sidebar__navlink nav-link"
                  to="/admin/szabadnapok"
                  id="szabadnapok"
                >
                  &nbsp;&nbsp;<i className="fa-solid fa-calendar-xmark"></i>
                  &nbsp;&nbsp; Szabadnapok
                </NavLink>
              </NavItem>
            )}
            {hasRole(user.roles, ["SZUPER_ADMIN", "SZOLGALTATASOK_ADMIN"]) && (
              <NavItem className="admin-sidebar__navitem">
                <NavLink
                  className="admin-sidebar__navlink nav-link"
                  to="/admin/szolgaltataskategoriak"
                  id="szolgaltataskategoriak"
                >
                  &nbsp;&nbsp;
                  <i aria-hidden className="fas fa-briefcase" />
                  &nbsp; Szolgáltatás kategóriák
                </NavLink>
              </NavItem>
            )}
            {hasRole(user.roles, ["SZUPER_ADMIN", "SZOLGALTATASOK_ADMIN"]) && (
              <NavItem className="admin-sidebar__navitem">
                <NavLink
                  className="admin-sidebar__navlink nav-link"
                  to="/admin/szolgaltatasok"
                  id="szolgaltatasok"
                >
                  &nbsp;&nbsp;
                  <i aria-hidden className="fas fa-briefcase" />
                  &nbsp; Szolgáltatások
                </NavLink>
              </NavItem>
            )}
            {hasRole(user.roles, ["SZUPER_ADMIN", "GALERIA_ADMIN"]) && (
              <NavItem className="admin-sidebar__navitem">
                <NavLink
                  className="admin-sidebar__navlink nav-link"
                  to="/admin/galeria"
                  id="galeria"
                >
                  &nbsp;&nbsp;
                  <i aria-hidden className="fas fa-briefcase" />
                  &nbsp; Galéria
                </NavLink>
              </NavItem>
            )}
            {hasRole(user.roles, ["SZUPER_ADMIN", "KAPCSOLATOK_ADMIN"]) && (
              <NavItem className="admin-sidebar__navitem">
                <NavLink
                  className="admin-sidebar__navlink nav-link"
                  to="/admin/kapcsolat"
                  id="kapcsolatok"
                >
                  &nbsp;&nbsp;
                  <i aria-hidden className="fa-solid fa-address-book" />
                  &nbsp; Kapcsolatok
                </NavLink>
              </NavItem>
            )}
            {hasRole(user.roles, ["SZUPER_ADMIN", "GDPR"]) && (
              <NavItem className="admin-sidebar__navitem">
                <NavLink
                  className="admin-sidebar__navlink nav-link"
                  to="/admin/adatkezeles"
                  id="Adatkezelés"
                >
                  &nbsp;&nbsp;<i aria-hidden className="fas fa-shield-alt"></i>
                  &nbsp;Adatkezelés
                </NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

AdminSidebar.propTypes = {
  user: PropTypes.any,
  hasRole: PropTypes.func,
};

export default AdminSidebar;
