import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

function AddProduct(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: {
      value: "",
    },
    image: {
      value: "",
    },
    price: {
      value: "",
    },
    description: {
      value: "",
    },
    isEditing: false,
  });

  useEffect(() => {
    if (props.isEditing) {
      setFormData((prevState) => {
        return {
          ...prevState,
          title: {
            value: props.selectedProduct.title,
          },
          image: {
            value: props.selectedProduct.imageUrl,
          },
          price: {
            value: props.selectedProduct.price,
          },
          description: {
            value: props.selectedProduct.description,
          },
        };
      });
    }
  }, [props.selectedProduct, props.isEditing]);

  const handleInputChange = (e, files) => {
    setFormData((prevState) => {
      // if (props.isEditing) {
      //   return {
      //     ...prevState,
      //     title: props.selectedProduct.title,
      //     price: props.selectedProduct.price,
      //     description: props.selectedProduct.description,
      //   };
      // } else {
      return {
        ...prevState,
        [e.target.name]: {
          ...prevState.image,
          value: files ? files[0] : e.target.value,
        },
      };
      // }
    });
  };
  const handleCreateEditProduct = (e, formData) => {
    e.preventDefault();

    let url = "http://localhost:3080/admin/product";
    let method = "POST";

    if (props.isEditing) {
      url = `http://localhost:3080/admin/product/${props.selectedProduct._id}`;
      method = "PUT";
    }

    const data = new FormData();
    data.append("title", formData.title.value);
    data.append("image", formData.image.value);
    data.append("price", formData.price.value);
    data.append("description", formData.description.value);

    fetch(url, {
      method: method,
      body: data,
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Creating or Editing a product failed!");
        }
        return res.json();
      })
      .then((resData) => {
        navigate("/admin/products");
      })
      .catch((err) => {
        throw new Error(err);
      });
  };
  return (
    <div>
      <h2 className="text-center">
        {props.isEditing ? "Edit the Product" : "Add New Product"}
      </h2>
      <Form
        onSubmit={(e) => handleCreateEditProduct(e, formData)}
        encType="multipart/form-data"
        className="col-lg-6 col-md-7 col-sm-5 col-10 mx-auto p-2"
        style={{ boxShadow: "0 2px 5px #6c757d" }}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter Title"
            value={formData.title.value}
            onChange={(e) => handleInputChange(e, e.target.files)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Item Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={(e) => handleInputChange(e, e.target.files)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Price($)</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price.value}
            placeholder="Price"
            onChange={(e) => handleInputChange(e, e.target.files)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Description</Form.Label>
          <FloatingLabel
            controlId="floatingTextarea2"
            label="Descriptions"
            style={{ fontSize: ".8rem", color: "#adb5bd" }}
          >
            <Form.Control
              as="textarea"
              placeholder="Description"
              name="description"
              value={formData.description.value}
              onChange={(e) => handleInputChange(e, e.target.files)}
              style={{ height: "100px" }}
            />
          </FloatingLabel>
        </Form.Group>
        <Form.Group className="text-center">
          <Button variant="primary" type="submit">
            {props.isEditing ? "Update Product" : "Add Product"}
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isEditing: state.isEditing,
    selectedProduct: state.selectedProduct,
  };
};

export default connect(mapStateToProps)(AddProduct);
