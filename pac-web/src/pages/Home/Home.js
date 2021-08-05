import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container, Row } from 'react-bootstrap';
import { GoogleLogout } from 'react-google-login';

const Home = () => {
  const [id, setValue] = useState('');
  const history = useHistory();
  const clientId = '1082753993159-va32d2tcalpqv67hnc0apngd0hsk48e0.apps.googleusercontent.com'; //TODO: move to enviornment variable

  const joinRoom = (id) => {
    console.log(id);
    history.push(`/room/${id}`);
  };

  const logoutSuccess = () => {
    history.push('/');
  };

  return (
    <Container>
      <Row className='justify-content-center'>
        <h1>Welcome ... </h1>
      </Row>
      <Row className='justify-content-center'>
        <input
          type='text'
          value={id}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => joinRoom(id)}>Join by ID</Button>
      </Row>
      <Row className='justify-content-center'>
        <GoogleLogout
          clientId={clientId}
          buttonText='Logout'
          onLogoutSuccess={logoutSuccess}
        />
      </Row>
    </Container>

  );
};

export default Home;
