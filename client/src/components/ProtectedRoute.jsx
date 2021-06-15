import PropTypes from "prop-types";
import React from "react";
import { Route, Redirect } from "react-router-dom";

import Auth from "../utils/authentication";

const ProtectedRoute = ({ component, onlyAdmin, ...rest }) => {
  const currentUser = Auth.getCurrentUser();
  const isAuthenticated = currentUser !== null;

  if (!isAuthenticated) {
    return <Redirect to={{ pathname: "/administration" }} />;
  }

  const { isAdmin } = currentUser;

  if (onlyAdmin && !isAdmin) {
    return <Redirect to={{ pathname: "/administration/menu" }} />;
  }

  return <Route component={component} {...rest} />;
};

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]).isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool,
  onlyAdmin: PropTypes.bool,
};

export default ProtectedRoute;
