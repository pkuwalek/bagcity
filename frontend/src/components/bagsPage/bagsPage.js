import React, { useEffect, useState, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Pagination from 'react-bootstrap/Pagination';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Accordion from 'react-bootstrap/Accordion';
import { getAllBags, getColors, getBrands, getStyles, filteredBags } from '../../sources/bags';
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
  const [colorIds, setColorIds] = useState([]);
  const [brandIds, setBrandIds] = useState([]);
  const [styleIds, setStyleIds] = useState([]);

  // toggle Offcanvas filter
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  // check if bag is owned by logged in user
  const markUsersBags = (bags) => {
    if (userContext.details) {
      return getUsersBagsIds(userContext.details.user_id, userContext.token)
        .then((response) => response.json())
        .then((response_json) => {
          const usersBags = response_json.map((bag) => bag.bag_id);
          // setAllBags(
          return bags.map((bag) => {
            if (usersBags.includes(bag.bag_id)) {
              return { ...bag, owned: true };
            }
            return { ...bag, owned: false };
          });
          // );
        })
        .catch((e) => setError(e));
    }
    return new Promise((resolve, reject) => {
      resolve(bags);
    });
  };

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
    if (allBags.length) {
      const endOffset = bagOffset + currentBagsCount;
      setCurrentBags(allBags.slice(bagOffset, endOffset));
      setPageCount(Math.ceil(allBags.length / bagsPerPage));
      setRePaginate(false);
    }
  }, [bagOffset, currentBagsCount, allBags, rePaginate]);

  const paginationItem = [];
  for (let num = 0; num < pageCount; num += 1) {
    paginationItem.push(
      <Pagination.Item key={num} active={num === activePage} onClick={() => handlePageChange(num)}>
        {num + 1}
      </Pagination.Item>
    );
  }

  // filter bags
  const filterBags = () => {
    const filterCriteria = { colorIds, brandIds, styleIds };
    filteredBags(filterCriteria)
      .then((response) => response.json())
      .then((response_json) => markUsersBags(response_json).then((markedBags) => setAllBags(markedBags)))
      // .then(() => markUsersBags())
      .catch(() => setError('Something went wrong, please try again later.'));
    setShowOffcanvas(false);
  };

  // remove all filters
  const removeFilters = () => {
    getAllBags()
      .then((response) => response.json())
      .then((response_json) => markUsersBags(response_json).then((markedBags) => setAllBags(markedBags)))
      // .then(() => markUsersBags())
      .catch(() => setError('Something went wrong, please try again later.'));
    setShowOffcanvas(false);
  };

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

  useEffect(() => {
    markUsersBags(allBags).then((markedBags) => setAllBags(markedBags));
  }, [userContext.details]);

  const loadMore = () => {
    setCurrentBagsCount(currentBagsCount + bagsPerPage);
    setActivePage(activePage + 1);
  };

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error);
    }
  }, [error]);

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
                  <Checkbox content={colors} name="color" currentValue={colorIds} valueSetter={setColorIds} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Brand</Accordion.Header>
                <Accordion.Body>
                  <Checkbox content={brands} name="brand" currentValue={brandIds} valueSetter={setBrandIds} />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Style</Accordion.Header>
                <Accordion.Body>
                  <Checkbox content={styles} name="style" currentValue={styleIds} valueSetter={setStyleIds} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <Button onClick={filterBags}>Filter</Button>
            <Button onClick={removeFilters}>Remove all filters</Button>
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
