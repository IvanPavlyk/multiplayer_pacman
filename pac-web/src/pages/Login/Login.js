import React from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { Form, Button, Container, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

const Login = () => {
  const history = useHistory();
  const clientId = '1082753993159-va32d2tcalpqv67hnc0apngd0hsk48e0.apps.googleusercontent.com'; //TODO: move to enviornment variable

  const onLoginSuccess = (response) => {
    const profile = response.profileObj;
    const user = {
      name: profile.name,
      email: profile.email
    };

    axios.post('http://localhost:3002/add-user', user) //TODO: push url to enviornment variable or helper function
      .then( res => {
        console.log(res);
        history.push('/home'); //TODO: push to create account page
      })
      .catch ( error => {
        console.error(error);
      });

  };

  const onLoginFailure = (response) => {
    alert('Error while logging in.' + response);
  };

  return (
    <Container>
      <Row className='justify-content-center'>
        <img src='/logo512.png'></img>
      </Row>
      <Row className='justify-content-center'>
        <GoogleLogin 
          clientId={clientId}
          buttonText='Log in with Google'
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          isSignedIn={true}
          cookiePolicy={'single_host_origin'}
        />
      </Row>
    </Container>
  );
};

export default Login;
