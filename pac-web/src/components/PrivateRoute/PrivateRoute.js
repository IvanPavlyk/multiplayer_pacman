import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ( {component: Component, ...rest} ) => {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');
  console.log(isAuthenticated);
  return (
    <Route
      {...rest}
      render={ (props) => {
        return isAuthenticated
          ? <Component {...rest} {...props} />
          : <Redirect to={'/'}/>;
      }}
    />
  );
};

export default PrivateRoute;