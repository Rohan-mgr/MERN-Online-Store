import React, { useState, useEffect } from "react";
import Image from "react-bootstrap/Image";
import withRouter from "../../../../HOC/withRouter";

function ProductDetails(props) {
  const [productDetails, setProductDetails] = useState({
    title: "",
    imageUrl: "",
    price: 0,
    description: "",
  });
  useEffect(() => {
    const productId = props.router.params.productId;
    fetch(`http://localhost:3000/product/${productId}`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("failed to fetch the product");
        }
        return res.json();
      })
      .then((resData) => {
        setProductDetails((prevState) => {
          return {
            ...prevState,
            title: resData.product.title,
            imageUrl: resData.product.imageUrl,
            price: resData.product.price,
            description: resData.product.description,
          };
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-center mt-5">
      <h3>Product Details</h3>
      <h4 style={{ color: "#f1b355" }}>{productDetails.title}</h4>
      <Image
        className="col-10 col-lg-4 col-md-8"
        src={
          "http://localhost:3000/" + productDetails.imageUrl.replace("\\", "/")
        }
        alt="nature"
        fluid={true}
      />
      <p>
        <span
          style={{ color: "#f1b355", fontWeight: "bold", marginRight: "7px" }}
        >
          Price:{" "}
        </span>
        {productDetails.price}
      </p>
      <p>
        <span
          style={{ color: "#f1b355", fontWeight: "bold", marginRight: "7px" }}
        >
          Description:
        </span>
        {productDetails.description}
      </p>
      {props.isAuth && (
        <button
          className="btn btn-warning"
          onClick={() => props.AddToCart(props.router.params.productId)}
        >
          Add To Cart
        </button>
      )}
    </div>
  );
}

export default withRouter(ProductDetails);
