import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../UI/Loader/Loader";

const PrivateRoute = (props) => {
  console.log(props.isAuth);
  if (props.isAuth === undefined) {
    return <Loader />;
  }
  return props.isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
