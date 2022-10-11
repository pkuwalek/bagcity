import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { UserContext } from '../../context/userContext';
import { getUserDetails } from '../../sources/users';
import UsersPageContent from './usersPageContent';

const UsersPage = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [userName, setUserName] = useState('');
  const [isReady, setIsReady] = useState('waiting');

  const getDetails = useCallback(() => {
    getUserDetails(userContext.token).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          setIsReady('accepted');
          return { ...oldValues, details: data };
        });
      } else {
        setUserContext((oldValues) => {
          setIsReady('rejected');
          return { ...oldValues, details: null };
        });
      }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    if (userContext.token === null) {
      setIsReady('rejected');
    } else if (!userContext.details && userContext.token) {
      getDetails();
    } else if (userContext.details) {
      setUserName(userContext.details.user_name);
    }
  }, [userContext.details, userContext.token, getDetails]);

  let currentContent;
  if (isReady === 'rejected') {
    currentContent = <Navigate replace to="/login" />;
  } else if (isReady === 'accepted') {
    currentContent = <UsersPageContent />;
  } else {
    currentContent = <Spinner animation="border" variant="secondary" />;
  }

  return <>{currentContent}</>;
};

export default UsersPage;
