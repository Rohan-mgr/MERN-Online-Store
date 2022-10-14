import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Contact.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loader from "../../../UI/Loader/Loader";
import { connect } from "react-redux";
import * as actions from "../../../../store/action/index";

function Contact(props) {
  const [visitorMessage, setVisitorMessage] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setVisitorMessage((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleMessageSubmission = (e, message) => {
    e.preventDefault();
    props.onLoading();
    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          const error = new Error("Message submission failed");
          throw error;
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        props.handleAlertStatus(true);
        window.scrollTo(0, 0);
        props.onFinishLoading();
        setVisitorMessage((prevState) => {
          return {
            ...prevState,
            name: "",
            email: "",
            subject: "",
            message: "",
          };
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  return (
    <Container className="contact_container col-11 col-lg-10 p-3 mb-5">
      <Row>
        <Col>
          <h2>Contact Us</h2>
          <Form onSubmit={(e) => handleMessageSubmission(e, visitorMessage)}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                required
                value={visitorMessage.name}
                placeholder="Enter Full Name"
                onChange={(e) => handleInputChange(e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>E-mail:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required
                value={visitorMessage.email}
                placeholder="Enter E-mail"
                onChange={(e) => handleInputChange(e)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Subject:</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                required
                value={visitorMessage.subject}
                placeholder="Enter Subject"
                onChange={(e) => handleInputChange(e)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message:</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                required
                value={visitorMessage.message}
                placeholder="Your Message..."
                onChange={(e) => handleInputChange(e)}
                style={{ height: "100px" }}
              />
            </Form.Group>
            <Button variant="warning" type="submit" className="my-auto">
              {props.isLoading ? (
                <>
                  <span style={{ color: "#f1b355" }}>Sending...</span>{" "}
                  <Loader Left="0" />
                </>
              ) : (
                <span style={{ color: "#f1b355" }}>Send</span>
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoading: () => dispatch(actions.initLoading()),
    onFinishLoading: () => dispatch(actions.finishLoading()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
