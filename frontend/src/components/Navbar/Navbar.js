import React, { useContext, useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../../context/userContext';
import { logoutUser, verifyUser, getUsersBagsIds } from '../../sources/users';
import ErrorAlert from '../Alerts/ErrorAlert';
import './Navbar.scss';

const NavbarMenu = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [name, setName] = useState('');

  useEffect(() => {
    if (userContext.details) {
      localStorage.setItem('name', JSON.stringify(userContext.details.user_name));
      getUsersBagsIds(userContext.details.user_id, userContext.token)
        .then((response) => response.json())
        .then((response_json) => {
          localStorage.setItem('bags', JSON.stringify(response_json.map((bag) => bag.bag_id)));
        });
    }
  }, [userContext.details]);

  useEffect(() => {
    const userName = JSON.parse(localStorage.getItem('name'));
    if (userName) {
      setName(userName);
    }
  }, []);

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
          localStorage.clear();
          window.location.reload(false);
          return { ...oldValues, details: undefined, token: null };
        });
      } else {
        <ErrorAlert error={'something went wrong'} />;
        // alert('Sorry, we cant log you out right now. Try again later.');
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
            <Nav.Link href="/bags">Bags</Nav.Link>
          </Nav>
          {userContext.token === null ? (
            <>
              <Nav.Link href="/register">Sign up</Nav.Link>
              <Nav.Link href="/login">Sign in</Nav.Link>
            </>
          ) : (
            <>
              <Navbar.Text className="p-2">Signed in as {name}</Navbar.Text>
              <Nav.Link className="p-2" href="/me">
                Dashboard
              </Nav.Link>
              <Button onClick={logoutHandler} variant="outline-dark">
                Logout
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMenu;
