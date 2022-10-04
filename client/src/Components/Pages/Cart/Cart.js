import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import CartItem from "./CartItem/CartItem";
import * as actions from "../../../store/action/index";
import { cartTotalPrice } from "../../../shared/utility";
import { Link } from "react-router-dom";

function Cart(props) {
  const [cartProducts, setCartProducts] = useState({
    products: [],
    total: 0,
  });
  useEffect(() => {
    props.onLoading();
    fetch("http://localhost:3080/cart", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        props.onFinishLoading();
        let sum = cartTotalPrice(resData.cartItems);
        setCartProducts((prevState) => {
          return {
            ...prevState,
            products: resData.cartItems,
            total: sum,
          };
        });
      })
      .catch((err) => {
        props.onFinishLoading();
        throw new Error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleDeleteCartItem = (prodId) => {
    fetch(`http://localhost:3080/cart/${prodId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          const err = new Error("failed to delete Cart Items");
          throw err;
        }
        return res.json();
      })
      .then((resData) => {
        let sum = cartTotalPrice(resData.cartItems);
        setCartProducts((prevState) => {
          return {
            ...prevState,
            products: resData.cartItems,
            total: sum,
          };
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleOrderItems = () => {
    fetch("http://localhost:3080/orders", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          const error = new Error("Failed to orders the products");
          throw error;
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        // navigate("/checkout");
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  return (
    <div className="px-4">
      {!props.isLoading ? (
        cartProducts.products.length > 0 ? (
          <div className="text-center">
            {cartProducts.products.map((p) => {
              return (
                <CartItem
                  key={p.productId._id}
                  prodId={p.productId._id}
                  Title={p.productId.title}
                  Quantity={p.quantity}
                  Price={p.productId.price}
                  ImageUrl={p.productId.imageUrl}
                  DeleteCartItem={() => handleDeleteCartItem(p.productId._id)}
                />
              );
            })}
            <h3 className="text-center">Total: ${cartProducts.total}</h3>
            <Link
              to="/checkout"
              className="btn btn-warning"
              onClick={handleOrderItems}
            >
              Order Now
            </Link>
          </div>
        ) : (
          <h2 className="text-center my-2">No Prouducts added to Cart</h2>
        )
      ) : (
        <h2 className="text-center">Loading Cart Products...</h2>
      )}
    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
