import React from "react";
import Alert from "react-bootstrap/Alert";
import "./Alert.css";

function AlertDismissible(props) {
  if (props.AlertStatus) {
    return (
      <Alert
        variant="success"
        className="mt-5 mx-2 col-11 col-lg-4 col-md-6"
        onClose={() => {
          console.log("click");
          props.handleAlertStatus(false);
        }}
        dismissible
      >
        <p>Your message is deliver successfully.</p>
      </Alert>
    );
  }
}

export default AlertDismissible;
