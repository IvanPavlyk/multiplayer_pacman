import React from 'react';
import { useColyseus } from 'components/ColyseusClient';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import './style.css';

const NavigationBar = ( {children} ) => {
  const client = useColyseus();
  const location = useLocation();
  const history = useHistory();

  const createAndJoinRoom = async () => {
    const room = window.room = await client.createNewRoom();
    history.push(`/room/${room.id}`);
  };

  const pushNavigationPage = (selectedKey) => {
    history.push(selectedKey);
  };

  const getNavigationBar = () => {
    if(location.pathname !== '/') {
      return (<div>
        <Navbar bg='dark'>
          <Navbar.Brand href='/home'>
            <img
              alt=''
              src='/logo192.png'
              width='30'
              height='30'
              className='d-inline-block align-top'
            />{' '}
            <span className='navigation-text'>PAC MAN</span>
          </Navbar.Brand>
          <Nav
            onSelect={pushNavigationPage}
          >
            <Nav.Link eventKey='/stats/global' className='navigation-text'>Global Stats</Nav.Link>
            <Nav.Link eventKey='/stats/account'className='navigation-text'>My Stats</Nav.Link>
            <Nav.Link eventKey='/account' className='navigation-text'>My Account</Nav.Link>
          </Nav>
          <Button className='mr-2' onClick={createAndJoinRoom} variant='outline-success'>Create Game</Button>
        </Navbar>
      </div>);
    } else {
      return null;
    }
  };

  return( <div>
    {getNavigationBar()}
    {children}
  </div>);
};

export default NavigationBar;