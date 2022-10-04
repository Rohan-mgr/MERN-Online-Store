import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import { validateForm } from "../../../../shared/utility";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";

function Signup(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChangeHandler = (e) => {
    setUserCredentials((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
    if (!!errors[e.target.name]) {
      setErrors((prevState) => {
        return {
          ...prevState,
          [e.target.name]: null,
        };
      });
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleUserCredentialsSubmission = (e, userData) => {
    e.preventDefault();
    const formError = validateForm(userData, "signup");
    if (Object.keys(formError).length > 0) {
      setErrors(formError);
    } else {
      props.onSignUp(userData, setErrors);
    }
  };

  return (
    <Form
      className="col-lg-4 col-md-8 col-sm-5 col-10 mx-auto pt-3 text-center"
      onSubmit={(e) => handleUserCredentialsSubmission(e, userCredentials)}
    >
      {!!errors.signupError && (
        <Form.Text className="login-errors">{errors.signupError}</Form.Text>
      )}
      <Form.Group className="mb-3 text-left" controlId="formBasicName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Name"
          name="name"
          value={userCredentials.name}
          onChange={(e) => handleInputChangeHandler(e)}
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3 text-left" controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={userCredentials.email}
          onChange={(e) => handleInputChangeHandler(e)}
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group
        className="mb-3 position-relative text-left"
        controlId="formBasicPassword"
      >
        <Form.Label>Password</Form.Label>
        {showPassword ? (
          <AiOutlineEyeInvisible
            className="outline-eye"
            onClick={togglePassword}
          />
        ) : (
          <AiOutlineEye className="outline-eye" onClick={togglePassword} />
        )}
        <Form.Control
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={userCredentials.password}
          autoComplete="off"
          onChange={(e) => handleInputChangeHandler(e)}
          name="password"
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>
      {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group> */}
      <Button variant="warning" className="mx-auto" type="submit">
        Sign UP
      </Button>
      <Form.Text>
        Already have an account? <Link to="/login">Sign In</Link>
      </Form.Text>
    </Form>
  );
}

export default Signup;
