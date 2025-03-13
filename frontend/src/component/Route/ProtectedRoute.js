import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";

const ProtectedRoute = ({ component: Component }) => {
  // const { loading ,isAuthenticated, user } = useSelector((state) => state.user);

  const user = localStorage.getItem('UserIDName')
  const isAuth = localStorage.getItem('isAuthenticated')

  // console.log(isAuthenticated, user, user?.role);

  // if (loading) return <Loader />;

  if ( isAuth !== "true" || user !== "admin") {
    return <Navigate to="/" />;
  }

  // if (user.role.name !== "Admin") {
  //   return <Navigate to="/" />;
  // }

  return <Component />;
};

export default ProtectedRoute;
