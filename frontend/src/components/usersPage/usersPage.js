import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { UserContext } from '../../context/userContext';
import { getUserDetails } from '../../sources/users';
import UsersPageContent from './usersPageContent';

const UsersPage = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [userName, setUserName] = useState('');
  const [currentContent, setCurrentContent] = useState('');

  const getDetails = useCallback(() => {
    getUserDetails(userContext.token).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          return { ...oldValues, details: data, userStatus: 'accepted' };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, details: null, userStatus: 'rejected' };
        });
      }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    if (userContext.token === null) {
      setUserContext((oldValues) => {
        return { ...oldValues, userStatus: 'rejected' };
      });
    } else if (!userContext.details && userContext.token) {
      getDetails();
    } else if (userContext.details) {
      setUserName(userContext.details.user_name);
    }
  }, [userContext.details, userContext.token, setUserContext, getDetails]);

  useEffect(() => {
    if (userContext.userStatus === 'rejected') {
      setCurrentContent(<Navigate replace to="/login" />);
    } else if (userContext.userStatus === 'accepted') {
      setCurrentContent(<UsersPageContent />);
    } else {
      setCurrentContent(<Spinner animation="border" variant="secondary" />);
    }
  }, [userContext.userStatus]);

  return <>{currentContent}</>;
};

export default UsersPage;
