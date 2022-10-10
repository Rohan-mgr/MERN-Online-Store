import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

function Checkout(props) {
  const [checkoutItems, setCheckoutItems] = useState({
    items: [],
    total: 0,
  });
  useEffect(() => {
    fetch("http://localhost:3080/checkout", {
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          const err = new Error("No products in checkout");
          throw err;
        }
        return res.json();
      })
      .then((resData) => {
        setCheckoutItems((prevState) => {
          return {
            ...prevState,
            items: resData.cartItems,
            total: resData.Total,
          };
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [props.token]);

  const handleCheckout = () => {
    fetch("http://localhost:3080/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
        Authorization: "Bearer " + props.token,
      },
      body: JSON.stringify({
        prods: checkoutItems.items,
      }),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          const err = new Error("failed to checkout");
          throw err;
        }
        return res.json();
      })
      .then((resData) => {
        window.location = resData.url;
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  return (
    <Container className="mt-5 col-11 text-center">
      {checkoutItems.items.length > 0 ? (
        <>
          {checkoutItems.items.map((i) => {
            return (
              <Row
                key={i.productId._id}
                className="justify-space-between text-left align-items-center p-2"
              >
                <Col className="col-6">
                  <h2>{i.productId.title}</h2>
                </Col>
                <Col className="text-right col-6">
                  <h3>{i.quantity}</h3>
                </Col>
              </Row>
            );
          })}
          <h2>Total: ${checkoutItems.total}</h2>
          <button className="btn btn-warning my-2" onClick={handleCheckout}>
            Checkout
          </button>
        </>
      ) : (
        <h2>No items to checkout</h2>
      )}
    </Container>
  );
}

export default Checkout;
