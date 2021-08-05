import React, {useState} from 'react';
import axios from 'axios';
import {Form, Button, Container} from 'react-bootstrap';
import { useLocation, withRouter, useHistory } from 'react-router';


const NewAccount = () => {
  const location = useLocation();
  const history = useHistory();
  const [accountInfo, setAccountInfo] = useState(
    location.state.detail
  );

  console.log(accountInfo);

  const handleChange = (event) => {
    setAccountInfo(
      {...accountInfo,
        username: event.target.value
      }
    );
  };
  
  const newAccountHandler = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3002/add-user', accountInfo) //TODO: push url to enviornment variable or helper function
      .then( res => {
        console.log(res);
        history.push('/home');
      })
      .catch ( error => {
        console.error(error);
      });
  };

  return (
    <Container>
      <Form onSubmit={newAccountHandler}>
        <Form.Group className='mb-3' controlId='formBasicEmail'>
          <Form.Control type='text' onChange={handleChange} placeholder='USERNAME'/>
        </Form.Group>
        <Button variant='primary' type='submit'>Submit</Button>
      </Form>
    </Container>
  );
};

export default withRouter(NewAccount);