import React, { useContext, useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../../context/userContext';
import { logoutUser, verifyUser } from '../../sources/users';

const NavbarMenu = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  const getRefreshToken = useCallback(() => {
    verifyUser().then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          return { ...oldValues, token: data.token };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, token: null };
        });
      }
      setTimeout(verifyUser, 5 * 60 * 1000);
    });
  }, [setUserContext]);

  useEffect(() => {
    getRefreshToken();
  }, [getRefreshToken]);

  const logoutHandler = () => {
    logoutUser(userContext.token).then(async (response) => {
      if (response.ok) {
        setUserContext((oldValues) => {
          return { ...oldValues, details: undefined, token: null };
        });
      } else {
        alert('Sorry, we cant log you out right now. Try again later.');
      }
      // window.localStorage.setItem('logout', Date.now());
    });
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/">Bagcity</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
          </Nav>
          {userContext.token === null ? (
            <>
              <Nav.Link href="/register">Sign up</Nav.Link>
              <Nav.Link href="/login">Sign in</Nav.Link>
            </>
          ) : (
            <>
              <Navbar.Text className="p-2">Signed in</Navbar.Text>
              <Nav.Link className="p-2" href="/me">
                Dashboard
              </Nav.Link>
              <Button onClick={logoutHandler} variant="outline-dark">
                Logout
              </Button>
              {/* <Nav.Link className="p-2" href="/logout">
                Logout
              </Nav.Link> */}
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMenu;
