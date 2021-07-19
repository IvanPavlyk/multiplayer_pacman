import React from 'react';
import { Form, Button, Container, Row } from 'react-bootstrap';

const Login = () => {
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
      </Row>
    </Container>
  );
};

export default Login;
