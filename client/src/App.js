import React, { useState, useEffect } from "react";
import "./App.css";
import Nav from "./Components/Navigation/Navbar/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import Product from "./Components/Pages/Product/product";
import ProductDetails from "./Components/Pages/Product/SingleProduct/ProductDetails";
import Home from "./Components/Pages/Home/Home";
import Admin from "./Components/Pages/Admin/admin";
import Cart from "./Components/Pages/Cart/Cart";
import Orders from "./Components/Pages/Orders/Orders";
import AddProduct from "./Components/Pages/Admin/products/AddProduct";
import Checkout from "./Components/Pages/Checkout/Checkout";
import AdminProducts from "./Components/Pages/Admin/products/AdminProducts";
import Login from "./Components/Pages/Login/Login";
import Signup from "./Components/Pages/Login/Signup/Signup";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";

function App(props) {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuth: false,
    token: null,
    userId: null,
  });
  const [showNav, setShowNav] = useState(true);
  useEffect(() => {
    if (window.location.href.includes("admin")) {
      setShowNav(false);
    }
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    if (!token || !expiryDate) {
      return;
    }
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setAuthState((prevState) => {
      return {
        ...prevState,
        isAuth: true,
        token: token,
        userId: userId,
      };
    });
    setAutoLogout(remainingMilliseconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authState.isAuth]);

  const handleUserCredentialsSubmission = (userData, setErrors) => {
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    fetch("http://localhost:3080/signup", { method: "POST", body: formData })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          if (res.status === 409) {
            throw new Error("Email address already exists!");
          } else {
            throw new Error("Creating a user failed!");
          }
        }
        return res.json();
      })
      .then((resData) => {
        navigate("/login");
      })
      .catch((err) => {
        setErrors((prevState) => {
          return {
            ...prevState,
            signupError: err.message,
          };
        });
        throw new Error(err);
      });
  };

  const logoutHandler = () => {
    setAuthState((prevState) => {
      return {
        ...prevState,
        isAuth: false,
        token: null,
      };
    });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiryDate");
    navigate("/login");
  };

  const setAutoLogout = (remainingTime) => {
    setTimeout(() => {
      logoutHandler();
    }, remainingTime);
  };

  const handleUserlogin = (userData, setErrors, setUserCredentials) => {
    const formData = new FormData();
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    fetch("http://localhost:3080/login", { method: "POST", body: formData })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Invalid Email Address & Password");
        }
        return res.json();
      })
      .then((resData) => {
        setAuthState((prevState) => {
          return {
            ...prevState,
            isAuth: true,
            token: resData.token,
            userId: resData.userId,
          };
        });
        localStorage.setItem("token", resData.token);
        localStorage.setItem("userId", resData.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        navigate("/");
      })
      .catch((err) => {
        setAuthState((prevState) => {
          return {
            ...prevState,
            isAuth: false,
            token: null,
            userId: null,
          };
        });
        setUserCredentials((prevState) => {
          return {
            ...prevState,
            email: "",
            password: "",
          };
        });
        setErrors((prevState) => {
          return {
            ...prevState,
            loginError: err.message,
          };
        });
        throw new Error(err);
      });
  };

  const handleAddToCart = (productId) => {
    fetch("http://localhost:3080/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authState.token,
      },
      body: JSON.stringify({
        prodId: productId,
      }),
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("User does not Exists");
        }
        return res.json();
      })
      .then((resData) => {
        navigate("/cart");
      })
      .catch((err) => {
        throw new Error(err);
      });
  };
  console.log(authState.isAuth);

  return (
    <div className="App">
      {showNav && (
        <Nav
          token={authState.token}
          isAuth={authState.isAuth}
          onLogout={logoutHandler}
        />
      )}
      {/* <Nav /> */}
      <Routes>
        <Route
          path="/product"
          element={
            <Product isAuth={authState.isAuth} AddToCart={handleAddToCart} />
          }
        />
        <Route
          path="/product/:productId"
          element={
            <ProductDetails
              {...props}
              isAuth={authState.isAuth}
              AddToCart={handleAddToCart}
            />
          }
        />
        <Route element={<PrivateRoute {...authState} />}>
          <Route path="/cart" element={<Cart token={authState.token} />} />
          <Route path="/orders" element={<Orders token={authState.token} />} />
        </Route>

        <Route
          path="/checkout"
          element={<Checkout token={authState.token} />}
        />
        <Route path="/login" element={<Login onSingIn={handleUserlogin} />} />
        <Route
          path="/signup"
          element={<Signup onSignUp={handleUserCredentialsSubmission} />}
        />
        <Route path="/admin/*" element={<Admin />}>
          <Route
            path="product"
            element={<AddProduct token={authState.token} />}
          />
          <Route path="products" element={<AdminProducts Admin={!showNav} />} />
        </Route>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
