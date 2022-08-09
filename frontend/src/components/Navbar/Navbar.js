import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavbarMenu = () => {
  return (
    <Navbar bg='light' expand='lg' sticky='top'>
      <Container>
        <Navbar.Brand href='#home'>Bagcity</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link href='#home'>Home</Nav.Link>
            <Nav.Link href='#link'>Link</Nav.Link>
          </Nav>
          <Navbar.Text>
            Signed in as: <a href='/me'>Mark Otto</a>
          </Navbar.Text>
          <Nav.Link href='/register'>Sign up</Nav.Link>
          <Nav.Link href='/login'>Sign in</Nav.Link>
          <Nav.Link href='/logout'>Logout</Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarMenu;