import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

const PrivateRoute = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const history = useHistory();

  const getPageIfAuthenticated = (isAuthenticated) => {
    if(isAuthenticated){
      //   return pushed route
    } else {
      //   return login page
    }
  };

  useEffect(() => {
    axios.get('/auth/isauthenticated').then(({data: {userIsAuthenticated}}) => {
      if(userIsAuthenticated) {
        setAuthenticated(true);
      }
    });
  });
    
};

export default PrivateRoute;