import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import { getUserDetails } from '../../sources/users';

const UsersPage = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [userName, setUserName] = useState('');

  const getDetails = useCallback(() => {
    getUserDetails(userContext.token).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUserContext((oldValues) => {
          return { ...oldValues, details: data };
        });
      } else {
        setUserContext((oldValues) => {
          return { ...oldValues, details: null };
        });
      }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    if (!userContext.details && userContext.token) {
      getDetails();
    }
    if (userContext.details) {
      setUserName(userContext.details.user_name);
    }
  }, [userContext.details, userContext.token, getDetails]);

  return userContext.details === undefined ? (
    <Navigate replace to="/login" />
  ) : (
    <>
      <h1>Greetings user</h1>
      <h3>{userName}</h3>
    </>
  );
};

export default UsersPage;
