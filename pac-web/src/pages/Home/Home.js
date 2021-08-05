import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Container, Row } from 'react-bootstrap';
import { GoogleLogout } from 'react-google-login';
import { useColyseus } from 'components/ColyseusClient';

import './home.scss';

import title_logo from 'assets/images/title-logo.png';

const Home = () => {
  const [id, setValue] = useState('');
  const client = useColyseus();
  const history = useHistory();
  const clientId = '1082753993159-va32d2tcalpqv67hnc0apngd0hsk48e0.apps.googleusercontent.com'; //TODO: move to enviornment variable

  const createAndJoinRoom = async () => {
    const room = window.room = await client.createNewRoom();
    history.push(`/room/${room.id}`);
  };

  const joinRoom = (id) => {
    if (id)
      history.push(`/room/${id}`);
  };

  const logoutSuccess = () => {
    history.push('/');
  };

  return (
    <Container className='home'>
      <div style={{ 'display': 'flex', 'flexDirection': 'column', 'alignItems': 'center' }}>

        <img className='mb-4' width='280' src={title_logo}/>
        <button className='create-btn' onClick={createAndJoinRoom}>Create a room</button>

        <div className='or-divider'>or</div>

        <Row>
          <input
            type='text'
            value={id}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={() => joinRoom(id)}>Join by ID</Button>
        </Row>
      </div>

      <Row className='justify-content-center'>
        <GoogleLogout
          clientId={clientId}
          buttonText='Logout'
          onLogoutSuccess={logoutSuccess}
          className='mt-4'
        />
      </Row>
    </Container>
  );
};

export default Home;
