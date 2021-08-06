import React from 'react';
import { useColyseus } from 'components/ColyseusClient';
import { Nav, Container, Button, ListGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './nav.scss';

import logo from 'assets/images/logo.png';

const NavigationBar = () => {
  const client = useColyseus();
  const history = useHistory();

  const createAndJoinRoom = async () => {
    if (window.room) return alert('You are already in a room!');
    const room = window.room = await client.createNewRoom();
    history.push(`/room/${room.id}`);
  };

  const pushNavigationPage = (selectedKey) => {
    if (window.room) {
      if (confirm('Are you sure you want to leave the room?')) {
        history.push(selectedKey);
        client.clearSession();
      }

    } else {
      history.push(selectedKey);
    }
  };

  return(
    <Nav className='main-nav' onSelect={pushNavigationPage}>
      <Container className='main-nav__container'>
        <Nav.Link className='main-nav__logo' eventKey='/'>
          <img src={logo} alt='logo'/>
        </Nav.Link>

        {/* LEFT MENU */}
        <ListGroup horizontal>
          <Nav.Link eventKey='/stats/global'>Global Stats</Nav.Link>
        </ListGroup>

        {/* RIGHT MENU */}
        <ListGroup horizontal>
          <Nav.Link eventKey='/stats/account'>My Matches</Nav.Link>
          <Nav.Link eventKey='/account'>My Account</Nav.Link>
          <Button onClick={createAndJoinRoom}>Create Room</Button>
        </ListGroup>
      </Container>
    </Nav>
  );
};

export default NavigationBar;