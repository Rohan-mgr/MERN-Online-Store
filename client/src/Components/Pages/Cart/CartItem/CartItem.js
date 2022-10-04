import React from "react";
import Image from "react-bootstrap/Image";
import { Container, Row, Col } from "react-bootstrap";
import "./CartItem.css";
import { BiTrash } from "react-icons/bi";

function CartItem(props) {
  return (
    <Container className="my-3 py-1 text-center">
      <Row className="position-relative justify-content-lg-between justify-content-around align-items-center text-center mx-auto">
        <Col lg={2} sm={7} xs={9}>
          <Image
            fluid={true}
            src={"http://localhost:3000/" + props.ImageUrl.replace("\\", "/")}
          />
        </Col>
        <Col lg={2} sm={7} xs={9}>
          <h5>{props.Title}</h5>
        </Col>
        <Col lg={2} sm={7} xs={9}>
          <h5>Quantity: {props.Quantity}</h5>
        </Col>
        <Col lg={2} sm={7} xs={9}>
          <h5>Price: ${props.Price * props.Quantity}</h5>
        </Col>
        <div>
          <BiTrash className="trash_bin" onClick={props.DeleteCartItem} />
        </div>
      </Row>
    </Container>
  );
}

export default CartItem;
