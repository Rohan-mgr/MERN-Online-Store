import React from "react";
import Footer from "./Admin-Sections/Footer";
import Header from "./Admin-Sections/Header";
import Main from "./Admin-Sections/Main";
import SideNav from "./Admin-Sections/SideNav";

function admin() {
  return (
    <div>
      <Header />
      <SideNav />
      <Main />
      {/* <Outlet /> */}
      <Footer />
    </div>
  );
}

export default admin;
