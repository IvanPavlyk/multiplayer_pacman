import axios from 'axios';
import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ( {component: Component, ...rest} ) => {
  useEffect(() => {
    const tokenId = sessionStorage.getItem('tokenId');
    axios.get(`http://localhost:3002/auth/user-is-authenticated/${tokenId}`)
      .then( res => {
        sessionStorage.setItem('isAuthenticated', res.data);
      });
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        sessionStorage.getItem('isAuthenticated') ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
};

export default PrivateRoute;