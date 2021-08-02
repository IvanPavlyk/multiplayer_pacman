import React, { useState } from 'react';
import { useColyseus } from 'components/ColyseusClient';
import { Navbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './style.css';

const NavigationBar = (props) => {
  const [id, setValue] = useState('');
  const client = useColyseus();
  const history = useHistory();

  const createAndJoinRoom = async () => {
    const room = window.room = await client.createNewRoom();
    console.log(room);
    joinRoom(room.id);
  };

  const joinRoom = (id) => {
    console.log(id);
    history.push(`/room/${id}`);
  };

  const pushNavigationPage = (selectedKey) => {
    history.push(selectedKey);
  };

  return( <div>
    <Navbar bg='dark'>
      <Container>
        <Navbar.Brand href='/'>
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
          <Nav.Link className='navigation-text'>Global Stats</Nav.Link>
          <Nav.Link eventKey='/stats/account'className='navigation-text'>My Stats</Nav.Link>
          <Nav.Link eventKey='/account' className='navigation-text'>My Account</Nav.Link>
        </Nav>
        <Button className='mr-2' onClick={createAndJoinRoom} variant='outline-success'>Create Game</Button>
        <Form className='d-flex'>
          <input
            type='text'
            className='mr-2'
            value={id}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button variant='secondary' onClick={() => joinRoom(id)}>Join by id</Button>
        </Form>
      </Container>
    </Navbar>
    {props.children}
  </div>);
};

export default NavigationBar;