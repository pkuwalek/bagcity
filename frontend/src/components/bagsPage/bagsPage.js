import React, { useEffect, useState, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Pagination from 'react-bootstrap/Pagination';
import { getAllBags } from '../../sources/bags';
import { getUserDetails, getUsersBagsIds } from '../../sources/users';
import { UserContext } from '../../context/userContext';
import BagCard from '../BagCard/BagCard';

const BagsPage = () => {
  const [allBags, setAllBags] = useState([]);
  const [error, setError] = useState('');
  const [userContext, setUserContext] = useContext(UserContext);
  const [currentBags, setCurrentBags] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [bagOffset, setBagOffset] = useState(0);
  const bagsPerPage = 16;
  const [currentBagsCount, setCurrentBagsCount] = useState(bagsPerPage);
  const [activePage, setActivePage] = useState(0);

  // get and set allBags
  useEffect(() => {
    getAllBags()
      .then((response) => response.json())
      .then((response_json) => setAllBags(response_json))
      .catch(() => setError('Something went wrong, please try again later.'));
  }, []);

  // pagination
  useEffect(() => {
    const endOffset = bagOffset + currentBagsCount;
    setCurrentBags(allBags.slice(bagOffset, endOffset));
    setPageCount(Math.ceil(allBags.length / bagsPerPage));
  }, [bagOffset, allBags, currentBagsCount]);

  const handlePageChange = (number) => {
    setCurrentBagsCount(bagsPerPage);
    const newOffset = (number * bagsPerPage) % allBags.length;
    setBagOffset(newOffset);
    setActivePage(number);
  };

  const paginationItem = [];
  for (let num = 0; num < pageCount; num += 1) {
    paginationItem.push(
      <Pagination.Item key={num} active={num === activePage} onClick={() => handlePageChange(num)}>
        {num + 1}
      </Pagination.Item>
    );
  }

  // chceck if user is logged in and get users info
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

  // check if bag is owned by logged in user
  useEffect(() => {
    if (userContext.details) {
      getUsersBagsIds(userContext.details.user_id, userContext.token)
        .then((response) => response.json())
        .then((response_json) => {
          const usersBags = response_json.map((bag) => bag.bag_id);
          setAllBags(
            allBags.map((bag) => {
              if (usersBags.includes(bag.bag_id)) {
                return { ...bag, owned: true };
              }
              return { ...bag, owned: false };
            })
          );
        })
        .catch((e) => setError(e));
    }
  }, [userContext.details]);

  const loadMore = () => {
    setCurrentBagsCount(currentBagsCount + bagsPerPage);
  };

  return (
    <>
      <Container>
        <Row xs={1} md={'auto'} className="g-4">
          {currentBags && currentBags.map((response) => <BagCard key={response.bag_id} bags={response} />)}
        </Row>
      </Container>
      {currentBagsCount + bagOffset <= allBags.length ? (
        <button onClick={loadMore}>Load more bags</button>
      ) : (
        <h4>No more bags to load</h4>
      )}
      <Pagination>
        <Pagination.Prev
          onClick={() => {
            if (activePage > 1) {
              handlePageChange(activePage - 1);
            }
          }}
        />
        {paginationItem}
        <Pagination.Next
          onClick={() => {
            if (activePage < pageCount) {
              handlePageChange(activePage + 1);
            }
          }}
        />
      </Pagination>
    </>
  );
};
export default BagsPage;
