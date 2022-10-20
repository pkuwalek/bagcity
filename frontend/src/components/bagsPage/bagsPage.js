import React, { useEffect, useState, useContext } from 'react';
import { getAllBags } from '../../sources/bags';
import { getUserDetails, getUsersBags } from '../../sources/users';
import { UserContext } from '../../context/userContext';
import BagCard from '../BagCard/BagCard';

const BagsPage = () => {
  const [allBags, setAllBags] = useState([]);
  const [error, setError] = useState('');
  const [userContext, setUserContext] = useContext(UserContext);

  useEffect(() => {
    getAllBags()
      .then((response) => response.json())
      .then((response_json) => setAllBags(response_json))
      .catch(() => setError('Something went wrong, please try again later.'));
  }, []);

  useEffect(() => {
    if (userContext.token) {
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
    }
  }, [userContext.token]);

  useEffect(() => {
    if (userContext.details) {
      getUsersBags(userContext.details.user_id, userContext.token)
        .then((response) => response.json())
        .then((response_json) => {
          if (response_json.length !== 0) {
            const usersBags = response_json.map((bag) => bag.bag_id);
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
        .catch((e) => setError(e));
    }
  }, [userContext.details]);

  return (
    <>
      <h1>Bags:</h1>
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
