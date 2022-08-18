import React , { useCallback, useContext, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import { getUserDetails } from '../../sources/users';

const UsersPage = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  const getDetails = useCallback(() => {
    getUserDetails().then(async response => {
      if (response.ok) {
        const data = await response.json();
        console.log(response);
        setUserContext(oldValues => {
          return { ...oldValues, details: data }
        })
      } else {
        setUserContext(oldValues => {
          return { ...oldValues, details: null }
        })
      }
    })
  }, [setUserContext]);

  useEffect(() => {
    if (!userContext.details) {
      getDetails();
    }
  }, [userContext.details, getDetails]);

  return userContext.details === null ? (
    <h1>Please log in or register to view this page.</h1>
  ) : (
    <>
      <h1>Greetings user</h1>
      <h3>{userContext.details}</h3>
    </>
  );
}

export default UsersPage;