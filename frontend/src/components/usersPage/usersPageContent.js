import React, { useContext, useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { UserContext } from '../../context/userContext';
import { getUsersBags } from '../../sources/users';
import BagCard from '../BagCard/BagCard';

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
      <Container>
        <Row xs={1} md={'auto'} className="g-4">
          {usersBags.map((response) => (
            <BagCard key={response.bag_id} bags={{ ...response.bags, owned: true }} />
          ))}
        </Row>
      </Container>
    </>
  );
};

export default UsersPageContent;
