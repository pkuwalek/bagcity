import React, { useEffect, useState, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { getBagById } from '../../sources/bags';
import { addBag, removeBag } from '../../sources/users';
import { UserContext } from '../../context/userContext';
import './bagPage.scss';

const BagPage = () => {
  const { id } = useParams();
  const [singleBag, setSingleBag] = useState({ brands: {}, colors: {}, types: {} });
  const [userContext] = useContext(UserContext);
  const [ownedBags, setOwnedBags] = useState([]);

  useEffect(() => {
    const usersBags = JSON.parse(localStorage.getItem('bags'));
    if (usersBags) {
      setOwnedBags(usersBags);
    }
  }, []);

  const btnAddHandler = () => {
    if (!ownedBags.includes(singleBag.bag_id)) {
      addBag(singleBag.bag_id, userContext.token).then((res) => {
        if (res.ok) {
          const oldBags = JSON.parse(localStorage.getItem('bags'));
          oldBags.push(singleBag.bag_id);
          localStorage.setItem('bags', JSON.stringify(oldBags));
          setOwnedBags(oldBags);
        } else {
          console.log(res);
        }
      });
    } else {
      // <ErrorAlert props={'You need to be logged in to add a bag'} />;
    }
  };

  const btnRemoveHandler = () => {
    removeBag(userContext.token, singleBag.bag_id).then((res) => {
      if (res.ok) {
        const oldBags = JSON.parse(localStorage.getItem('bags'));
        const newBags = oldBags.filter((bags) => bags !== singleBag.bag_id);
        localStorage.setItem('bags', JSON.stringify(newBags));
        setOwnedBags(newBags);
      } else {
        console.log(res);
      }
    });
  };

  useEffect(() => {
    getBagById(id)
      .then((response) => response.json())
      .then((response_json) => setSingleBag(response_json))
      .catch((error) => console.error(error));
  }, [id]);

  return (
    <Container>
      <Row>
        <Col md={true}>
          <img src={singleBag.photo_url} alt="bag"></img>
        </Col>
        <Col md={true}>
          <h1>{singleBag.brands.brand_name}</h1>
          <h3>{singleBag.bag_name}</h3>
          <h4>Price:&nbsp;</h4>
          <p>{singleBag.price}$</p>
          <br />
          <h4>Color:&nbsp;</h4>
          <p>{singleBag.colors.color_name}</p>
          <br />
          <h4>Type:&nbsp;</h4>
          <p>{singleBag.types.type_name}</p>
          <br />
          <h4>Description:</h4>
          <p>{singleBag.description}</p>
          <div className="d-grid gap-2">
            {ownedBags.includes(singleBag.bag_id) ? (
              <Button onClick={btnRemoveHandler} variant="secondary">
                Remove from collection
              </Button>
            ) : (
              <Button onClick={btnAddHandler} variant="primary">
                Add to collection
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default BagPage;
