import React, { useEffect, useState, useContext } from 'react';
import { getAllBags } from '../../sources/bags';
import { getUserDetails, getUsersBags } from '../../sources/users';
import { UserContext } from '../../context/userContext';
import BagCard from '../BagCard/BagCard';

const BagsPage = () => {
  const [allBags, setAllBags] = useState([]);
  const [error, setError] = useState('');
  const [usersBags, setUsersBags] = useState([]);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    getAllBags()
      .then((response) => response.json())
      .then((response_json) => setAllBags(response_json))
      .catch(() => setError('Something went wrong, please try again later.'));
  }, []);

  useEffect(() => {
    // if user context have token fetch users bags
    if (userContext.token) {
      // getDetails();
      getUsersBags(4, userContext.token)
        .then((response) => response.json())
        .then((response_json) => {
          if (response_json.length !== 0) {
            setUsersBags(response_json.map((bag) => bag.bag_id));
            setAllBags(
              allBags.map((bag) => {
                if (usersBags.includes(bag.bag_id)) {
                  return { ...bag, owned: true };
                }
                return { ...bag, owned: false };
              })
            );
          }
        })
        .catch(() => setError('Something went wrong, please try again later.'));
    }
    // modify allBags by adding info if owned
  }, [allBags, userContext.token]);

  return (
    <>
      <h1>Bags:</h1>
      <p>{JSON.stringify(usersBags)}</p>
      <div>
        <span>
          {allBags.map((response) => (
            <BagCard key={response.bag_id} bags={response} />
          ))}
        </span>
      </div>
    </>
  );
};
export default BagsPage;
