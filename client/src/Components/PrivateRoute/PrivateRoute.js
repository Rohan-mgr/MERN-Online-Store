import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../UI/Loader/Loader";

const PrivateRoute = (props) => {
  if (props.isAuth === false) {
    <Loader />;
  }
  console.log(props.isAuth);

  return props.isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
