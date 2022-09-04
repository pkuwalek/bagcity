import React, { useCallback, useContext, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import { getUserDetails } from '../../sources/users';

const UsersPage = () => {
  const [userContext, setUserContext] = useContext(UserContext);

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
  }, [userContext.details, userContext.token, getDetails]);

  return userContext.details === null ? (
    <h1>Please log in or register to view this page.</h1>
  ) : (
    <>
      <h1>Greetings user</h1>
      <h3>{JSON.stringify(userContext.details)}</h3>
    </>
  );
};

export default UsersPage;
