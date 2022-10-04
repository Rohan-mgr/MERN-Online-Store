import React, { useState, useEffect } from "react";
import Card from "../../UI/Card/Card";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import * as actions from "../../../store/action/index";

function Product(props) {
  const [productDetails, setProductDetails] = useState({
    products: [],
    singleProduct: null,
  });
  useEffect(() => {
    props.onLoading();
    fetch(`http://localhost:3080/product`)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((resData) => {
        props.onFinishLoading();
        setProductDetails((prevState) => {
          return {
            ...prevState,
            products: resData.products.map((product) => {
              return {
                ...product,
              };
            }),
          };
        });
      })
      .catch((err) => {
        props.onFinishLoading();
        throw new Error(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid={true} className="pt-3">
      {props.isLoading ? (
        <h3 className="text-center">Loading Products...</h3>
      ) : productDetails.products.length > 0 ? (
        <Row>
          {productDetails.products.map((product) => {
            return (
              <Col
                key={product._id}
                lg={3}
                md={4}
                sm={6}
                className="justify-content-center"
              >
                <Card
                  productInfo={product}
                  Auth={props.isAuth}
                  HandleCart={() => props.AddToCart(product._id)}
                />
              </Col>
            );
          })}
        </Row>
      ) : (
        <h1 className="text-center">No Products Available</h1>
      )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Product);
