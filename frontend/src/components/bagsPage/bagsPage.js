import React, { useEffect, useState, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Pagination from 'react-bootstrap/Pagination';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';
import { getAllBags, getColors, getBrands, getStyles } from '../../sources/bags';
import { getUserDetails, getUsersBagsIds } from '../../sources/users';
import { UserContext } from '../../context/userContext';
import BagCard from '../BagCard/BagCard';
import Checkbox from './Checkbox/Checkbox';
import ScrollButton from './ScrollButton/ScrollButton';
import './bagsPage.scss';

const BagsPage = () => {
  const [allBags, setAllBags] = useState([]);
  const [colors, setColors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [styles, setStyles] = useState([]);
  const [error, setError] = useState('');
  const [userContext, setUserContext] = useContext(UserContext);
  const [currentBags, setCurrentBags] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [bagOffset, setBagOffset] = useState(0);
  const bagsPerPage = 16;
  const [currentBagsCount, setCurrentBagsCount] = useState(bagsPerPage);
  const [activePage, setActivePage] = useState(0);
  const [rePaginate, setRePaginate] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  // toggle Offcanvas filter
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  // get and set allBags
  useEffect(() => {
    getAllBags()
      .then((response) => response.json())
      .then((response_json) => setAllBags(response_json))
      .catch(() => setError('Something went wrong, please try again later.'));
  }, []);

  // get available colors
  useEffect(() => {
    getColors()
      .then((response) => response.json())
      .then((response_json) => {
        setColors(response_json);
      })
      .catch(() => setError('Something went wrong, please try again later.'));
  }, []);

  // get available brands
  useEffect(() => {
    getBrands()
      .then((response) => response.json())
      .then((response_json) => {
        setBrands(response_json);
      })
      .catch(() => setError('Something went wrong, please try again later.'));
  }, []);

  // get available styles
  useEffect(() => {
    getStyles()
      .then((response) => response.json())
      .then((response_json) => {
        setStyles(response_json);
      })
      .catch(() => setError('Something went wrong, please try again later.'));
  }, []);

  const handlePageChange = (number) => {
    setCurrentBagsCount(bagsPerPage);
    const newOffset = (number * bagsPerPage) % allBags.length;
    setBagOffset(newOffset);
    setActivePage(number);
  };

  // pagination
  useEffect(() => {
    const endOffset = bagOffset + currentBagsCount;
    setCurrentBags(allBags.slice(bagOffset, endOffset));
    setPageCount(Math.ceil(allBags.length / bagsPerPage));
    setRePaginate(false);
  }, [bagOffset, currentBagsCount, allBags, rePaginate]);

  const paginationItem = [];
  for (let num = 0; num < pageCount; num += 1) {
    paginationItem.push(
      <Pagination.Item key={num} active={num === activePage} onClick={() => handlePageChange(num)}>
        {num + 1}
      </Pagination.Item>
    );
  }

  // sort bags
  const sortAToZ = (sortField) => {
    if (['bag_name'].includes(sortField)) {
      setAllBags(
        allBags.sort((a, b) => {
          const nameA = a[sortField].toUpperCase();
          const nameB = b[sortField].toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        })
      );
    } else if (['brand_name'].includes(sortField)) {
      setAllBags(
        allBags.sort((a, b) => {
          const nameA = a.brands[sortField].toUpperCase();
          const nameB = b.brands[sortField].toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        })
      );
    } else if (['priceAsc'].includes(sortField)) {
      setAllBags(allBags.sort((a, b) => a.price - b.price));
    } else if (['priceDesc'].includes(sortField)) {
      setAllBags(allBags.sort((a, b) => b.price - a.price));
    }
    handlePageChange(0);
    setRePaginate(true);
  };

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
    setActivePage(activePage + 1);
  };

  return (
    <>
      <Container>
        <DropdownButton id="dropdown-item-button" title="Sort" onSelect={sortAToZ}>
          <Dropdown.Item as="button" eventKey="bag_name">
            bag name
          </Dropdown.Item>
          <Dropdown.Item as="button" eventKey="brand_name">
            brand name
          </Dropdown.Item>
          <Dropdown.Item as="button" eventKey="priceAsc">
            price ascending
          </Dropdown.Item>
          <Dropdown.Item as="button" eventKey="priceDesc">
            price descending
          </Dropdown.Item>
        </DropdownButton>
        <Button variant="primary" onClick={handleShowOffcanvas}>
          Filter
        </Button>
        <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filter by</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Color</Accordion.Header>
                <Accordion.Body>
                  <Checkbox key="colorCheckbox" content={colors} name="color" />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Brand</Accordion.Header>
                <Accordion.Body>
                  <Checkbox key="brandCheckbox" content={brands} name="brand" />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Style</Accordion.Header>
                <Accordion.Body>
                  <Checkbox key="styleCheckbox" content={styles} name="style" />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Offcanvas.Body>
        </Offcanvas>
        <Row xs={1} md={'auto'} className="g-4">
          {currentBags && currentBags.map((response) => <BagCard key={response.bag_id} bags={response} />)}
        </Row>
      </Container>
      <ScrollButton />
      {currentBagsCount + bagOffset <= allBags.length ? (
        <button className="load-more-btn" onClick={loadMore}>
          Load more bags
        </button>
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
