import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Orders.css";

function Orders(props) {
  const [orderedItems, setOrderedItems] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3080/orders", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          const error = new Error("Failed to fetch the orders");
          throw error;
        }
        return res.json();
      })
      .then((resData) => {
        setOrderedItems(resData.orderedItems);
      })
      .catch((err) => {
        throw new Error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(orderedItems);
  return (
    <Container>
      {orderedItems.length > 0 ? (
        <ul className="orders">
          {orderedItems.map((p) => {
            return (
              <li className="orders__item">
                <h2>
                  Order - # {p._id} - <a>Invoice</a>
                </h2>
                <ul class="orders__products">
                  {p.products.map((i) => {
                    return (
                      <li class="orders__products__item">
                        {i.product.title} ({i.quantity})
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      ) : (
        <h2 className="text-center">No products available!</h2>
      )}
    </Container>
  );
}

export default Orders;
