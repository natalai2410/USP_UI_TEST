import React from "react";
import { Link } from "react-router-dom";

const ProtectedRoute = ({ onLogin, children }) => {
  if (!onLogin) {
    return <Link to="/" replace />;
  }
  return children;
};
export default ProtectedRoute;
