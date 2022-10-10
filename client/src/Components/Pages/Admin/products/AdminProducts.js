import React, { useState, useEffect } from "react";
import Card from "../../../UI/Card/Card";
import { Container, Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import * as actions from "../../../../store/action/index";
import { useNavigate } from "react-router-dom";

function AdminProduct(props) {
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState({
    products: [],
  });
  useEffect(() => {
    fetch(`http://localhost:3080/admin/products`, {
      method: "GET",
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((resData) => {
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
        throw new Error(err);
      });
  }, []);

  const handleEditProduct = (productId) => {
    props.onEditingProduct();
    const seletedProduct = productDetails.products.filter(
      (p) => p._id === productId
    );
    props.onSelectingProduct(seletedProduct[0]);
    navigate("/admin/product");
  };

  const handleProductDelete = (productId) => {
    fetch(`http://localhost:3080/admin/products/${productId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Deleting a product failed");
        }
        return res.json();
      })
      .then((resData) => {
        setProductDetails((prevState) => {
          const updatedProducts = prevState.products.filter(
            (p) => p._id !== productId
          );
          return {
            ...prevState,
            products: updatedProducts,
          };
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  return (
    <Container fluid={true} className="mt-5">
      {productDetails.products.length > 0 ? (
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
                  key={product._id}
                  isAdmin={props.Admin}
                  productInfo={product}
                  onDeleteProduct={() => {
                    handleProductDelete(product._id);
                  }}
                  onEditProduct={() => {
                    handleEditProduct(product._id);
                  }}
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
    isEditing: state.isEditing,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onEditingProduct: () => dispatch(actions.editProduct()),
    onSelectingProduct: (product) => dispatch(actions.selectProduct(product)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminProduct);
