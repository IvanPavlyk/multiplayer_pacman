/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ( {component: Component, ...rest} ) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('/auth/isauthenticated').then(({data: {userIsAuthenticated}}) => {
      if(userIsAuthenticated) {
        setAuthenticated(true);
      }
    });
  });

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
};

export default PrivateRoute;