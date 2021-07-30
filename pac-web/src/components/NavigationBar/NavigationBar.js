import React from 'react';
import {Navbar, Nav, Container, Form, FormControl, Button} from 'react-bootstrap';
import './style.css';

const NavigationBar = (props) => {
  return( <div>
    <Navbar bg='dark'>
      <Container>
        <Navbar.Brand href='#home'>
          <img
            alt=''
            src='/logo192.png'
            width='30'
            height='30'
            className='d-inline-block align-top'
          />{' '}
          <span className='navigation-text'>PAC MAN</span>
        </Navbar.Brand>
        <Nav>
          <Nav.Link className='navigation-text'>My Stats</Nav.Link>
          <Nav.Link className='navigation-text'>Global Stats</Nav.Link>
          <Nav.Link className='navigation-text'>Create Game</Nav.Link>
        </Nav>
        <Form className='d-flex'>
          <FormControl
            type='search'
            placeholder='Join by ID'
            className='mr-2'
            aria-label='Search'
          />
          <Button>Play</Button>
        </Form>
      </Container>
    </Navbar>
    {props.children}
  </div>);
};

export default NavigationBar;