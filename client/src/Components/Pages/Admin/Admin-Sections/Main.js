import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import MainContent from "./MainContent";

function Main() {
  const [showMainContent, setShowMainContent] = useState(true);
  // const [currentLocation, setCurrentLocation] = useState(window.location.href);
  useEffect(() => {
    if (
      window.location.href.includes("admin/product") ||
      window.location.href.includes("admin/products")
    ) {
      setShowMainContent(false);
    }
  }, [showMainContent]);
  console.log(showMainContent);
  return (
    <div className="content-wrapper">
      {showMainContent && <MainContent />}
      {/* <MainContent /> */}
      <Outlet />
    </div>
  );
}

export default Main;
