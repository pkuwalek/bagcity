import React, { useEffect, useState, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
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

  const handlePageClick = (event) => {
    setCurrentBagsCount(bagsPerPage);
    const newOffset = (event.selected * bagsPerPage) % allBags.length;
    setBagOffset(newOffset);
  };

  // chceck if user is loggend in and get users info
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
      <button onClick={loadMore}>Load more bags</button>
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </>
  );
};
export default BagsPage;
