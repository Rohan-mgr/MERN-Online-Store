import React from "react";
import "./SideNav.css";

function SideNav() {
  return (
    <div>
      <aside
        className="main-sidebar sidebar-dark-primary elevation-4"
        style={{ backgroundColor: "#f1b355", color: "#000" }}
      >
        {/* Brand Logo */}
        <a
          href="/admin"
          className="brand-link"
          style={{
            color: "#fff",
            boxShadow: "none",
          }}
        >
          <img
            src="/dist/img/shopping-cart.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{
              opacity: ".8",
              boxShadow: "none",
              borderRadius: "0",
            }}
          />
          <span className="brand-text font-weight-light">ONLINE STORE</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="/dist/img/user2-160x160.jpg"
                className="img-circle elevation-2"
                alt="User"
              />
            </div>
            <div className="info">
              <a href="/" className="d-block">
                Alexander Pierce
              </a>
            </div>
          </div>
          {/* SidebarSearch Form */}

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <a href="/admin/product" className="nav-link">
                  <i className="nav-icon fa fa-plus-circle" />
                  <p>Add Product</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="/admin/products" className="nav-link">
                  <i className="nav-icon fa fa-shopping-basket" />
                  <p>Products</p>
                </a>
              </li>
              <li className="nav-item">
                <a href="/" className="nav-link">
                  <i className="nav-icon fa fa-home" />
                  <p>Home</p>
                </a>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
}

export default SideNav;
