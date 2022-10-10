import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import "./Orders.css";
import Loader from "../../UI/Loader/Loader";
import { connect } from "react-redux";
import * as actions from "../../../store/action/index";

function Orders(props) {
  const [orderedItems, setOrderedItems] = useState([]);
  useEffect(() => {
    props.onLoading();
    console.log(props.token);
    fetch("http://localhost:3080/orders", {
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
        props.onFinishLoading();
        setOrderedItems(resData.orderedItems);
      })
      .catch((err) => {
        props.onFinishLoading();
        throw new Error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.token]);

  const handleInvoice = (orderId) => {
    let fileName;
    fetch(`http://localhost:3080/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
        Authorization: "Bearer " + props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          const error = new Error("Failed to fectch Invoice");
          throw error;
        }
        fileName = res.url.substring(
          res.url.indexOf("orders") + 7,
          res.url.length
        );
        return res.blob();
      })
      .then((resData) => {
        const url = window.URL.createObjectURL(new Blob([resData]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice-${fileName}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  return (
    <Container className="mt-5">
      {props.isLoading ? (
        <Loader />
      ) : orderedItems?.length > 0 ? (
        <ul className="orders">
          {orderedItems?.map((p) => {
            return (
              <li key={p._id} className="orders__item">
                <h2>
                  Order - # {p._id} -{" "}
                  <button onClick={() => handleInvoice(p._id)}>Invoice</button>
                </h2>
                <ul className="orders__products">
                  {p.products?.map((i) => {
                    return (
                      <li key={i._id} className="orders__products__item">
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
      {/* <h1>orders</h1> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
