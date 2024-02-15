import React from "react";
import { Outlet } from "react-router-dom";

import AdminHeader from "../components/Header/AdminHeader.js";
import AdminSidebar from "../components/Sidebar/AdminSidebar.js";
import AdminFooter from "../components/Footer/AdminFooter.js";

const Admin = (props) => {
  const { children } = props;
  return (
    <div className="admin_full">
      <AdminHeader {...props} />
      <main className="admin_content">
        <AdminSidebar {...props} />
        <div className="tartalom-admin">{children}</div>
      </main>
      <AdminFooter />
    </div>
  );
};

export default Admin;
