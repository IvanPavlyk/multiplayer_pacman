import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ( {component: Component, ...rest} ) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');
  
  return (
    <Route
      {...rest}
      render={ (props) => {
        return isAuthenticated
          ? <Component {...props} />
          : <Redirect to='/'/>;
      }}
    />
  );
};

export default PrivateRoute;