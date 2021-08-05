import React, {useState} from 'react';
import axios from 'axios';
import {Form, Button, Container} from 'react-bootstrap';


const NewAccount = (googleUserProfile) => {
  const [accountInfo, setAccountInfo] = useState(googleUserProfile);

  const handleChange = (event) => {
    setAccountInfo(
      {...accountInfo,
        username: event.target.value
      }
    );
  };
  
  const newAccountHandler = () => {
    axios.post('http://localhost:3002/add-user', accountInfo) //TODO: push url to enviornment variable or helper function
      .then( res => {
        console.log(res);
        history.push('/home'); //TODO: push to create account page
      })
      .catch ( error => {
        console.error(error);
      });
  };

  return (
    <Container>
      <Form>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Label>PLAYER NAME</Form.Label>
          <Form.Control type='text' onChange={handleChange}/>
        </Form.Group>
        <Button variant='primary' type='submit' onClick={newAccountHandler}>Submit</Button>
      </Form>
    </Container>
  );
};

export default NewAccount;