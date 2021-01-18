import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const auth = localStorage.getItem('auth');

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        auth ? <Component {...props} {...rest} /> : <Redirect to='/login' />
      }
    />
  );
};

export default ProtectedRoute;
