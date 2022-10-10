import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Contact.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loader from "../../../UI/Loader/Loader";

function Contact() {
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
    <Container className="contact_container col-11 col-lg-10 p-3">
      <Row>
        <Col>
          <h2>Contact Us</h2>
          <Form onSubmit={(e) => handleMessageSubmission(e, visitorMessage)}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
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
                value={visitorMessage.message}
                placeholder="Your Message..."
                onChange={(e) => handleInputChange(e)}
                style={{ height: "100px" }}
              />
            </Form.Group>
            <Button variant="warning" type="submit">
              {/* Send Message */}
              <Loader Left="0" />
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
