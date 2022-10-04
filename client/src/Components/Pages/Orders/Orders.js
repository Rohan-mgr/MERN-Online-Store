import React, { useState, useEffect } from "react";

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
        console.log(resData);
      })
      .catch((err) => {
        throw new Error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>Order items</div>;
}

export default Orders;
