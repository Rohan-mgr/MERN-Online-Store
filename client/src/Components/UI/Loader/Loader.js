import React from "react";
import "./Loader.css";

function Loader({ borderColor, Left }) {
  return (
    <span
      className="loader"
      style={{
        left: Left ? `${Left}` : "50%",
      }}
    ></span>
  );
}

export default Loader;
