import React, { useContext, useCallback, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { UserContext } from '../../context/userContext';
import { verifyUser } from '../../sources/users';

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
              <Navbar.Text>
                Signed in as: <a href="/me">name-here</a>
              </Navbar.Text>
              <Nav.Link href="/logout">Logout</Nav.Link>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMenu;
