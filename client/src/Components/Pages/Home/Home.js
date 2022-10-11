import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Contact from "./Contact/Contact";
import "./Home.css";
import AlertDismissible from "../../UI/Alert/Alert";
import Footer from "../Admin/Admin-Sections/Footer";

function Home() {
  const navigate = useNavigate();
  const [alertStatus, setAlertStatus] = useState(false);
  console.log(alertStatus);
  setTimeout(() => {
    if (alertStatus) {
      setAlertStatus(false);
    }
  }, 5000);
  return (
    <>
      <AlertDismissible
        AlertStatus={alertStatus}
        handleAlertStatus={setAlertStatus}
      />
      <Container className="home_container">
        <Row className="col-12 home_row mx-auto">
          <Col className="home_col my-5">
            <h2>Get your products Now</h2>
            <button
              className="btn btn-warning home_button"
              onClick={() => navigate("/product")}
            >
              Shop Now
            </button>
          </Col>
          <Col className="home_col">
            <Image
              style={{ width: "250px", height: "250px" }}
              src={require("../../../Images/banner.webp")}
            />
          </Col>
        </Row>
      </Container>
      <Contact handleAlertStatus={setAlertStatus} />
      <Footer />
    </>
  );
}

export default Home;
