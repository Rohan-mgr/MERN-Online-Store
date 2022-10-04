import React from "react";

function Footer() {
  return (
    <div
      style={{
        background: "#f1b355",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "3rem",
      }}
    >
      <p style={{ margin: 0, padding: 0 }}>
        ONLINE Store &copy; {new Date().getFullYear()}. All Rights Reserved
      </p>
    </div>
  );
}

export default Footer;
