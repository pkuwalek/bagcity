import React, { useContext, useState, useEffect } from 'react';
import BagCard from '../BagCard/BagCard';
import { UserContext } from '../../context/userContext';
import { getUsersBags } from '../../sources/users';

const UsersPageContent = () => {
  const [userContext] = useContext(UserContext);
  const [usersBags, setUsersBags] = useState([]);
  const [error, setError] = useState('');
  const userId = userContext.details.user_id;

  useEffect(() => {
    getUsersBags(userId, userContext.token)
      .then((response) => response.json())
      .then((response_json) => setUsersBags(response_json))
      .catch(() => setError('Something went wrong, please try again later.'));
  }, [userContext.token, userId]);

  return (
    <>
      <h2>Welcome to users page {userContext.details.user_name} </h2>
      <h3>Your ID is {userContext.details.user_id}</h3>
      {/* <h4>{JSON.stringify(usersBags)}</h4> */}
      <span>
        {usersBags.map((response) => (
          <BagCard key={response.bag_id} bags={response.bags} />
        ))}
      </span>
    </>
  );
};

export default UsersPageContent;
