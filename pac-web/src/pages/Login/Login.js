import React from 'react';
import { Form, Button, Container, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

const Login = () => {
  const history = useHistory();

  const handleLogin = (response) => {
    console.log(response);
    history.push('/room'); //TODO: push to create account page
  };

  return (
    <Container>
      <Row className='justify-content-center'>
        <Form>
          <Form.Group controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control type='email' placeholder='Enter email' />
          </Form.Group>
          <Form.Group controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' placeholder='Password' />
          </Form.Group>
          <Button variant='primary' type='submit'>
                        Submit
          </Button>
        </Form>
        <GoogleLogin
          clientId={
            '1082753993159-va32d2tcalpqv67hnc0apngd0hsk48e0.apps.googleusercontent.com'
          }
          buttonText='Log in with Google'
          onSuccess={handleLogin}
          onFailure={handleLogin}
          cookiePolicy={'single_host_origin'}
        />
      </Row>
    </Container>
  );
};

export default Login;
