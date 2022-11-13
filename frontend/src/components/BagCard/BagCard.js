import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../../context/userContext';
import ErrorAlert from '../Alerts/ErrorAlert';
import SuccessAlert from '../Alerts/SuccessAlert';
import { addBag, removeBag } from '../../sources/users';
import './bagCard.scss';

const BagCard = (props) => {
  const [userContext] = useContext(UserContext);
  const [currentBag, setCurrentBag] = useState(props.bags);

  useEffect(() => setCurrentBag(props.bags), [props.bags]);

  const btnAddHandler = () => {
    if (currentBag.owned === false) {
      addBag(currentBag.bag_id, userContext.token).then((res) =>
        res.ok ? setCurrentBag({ ...currentBag, owned: true }) : console.log(res)
      );
    } else {
      // <ErrorAlert props={'You need to be logged in to add a bag'} />;
    }
  };

  const btnRemoveHandler = () => {
    removeBag(userContext.token, currentBag.bag_id).then((res) =>
      res.ok ? setCurrentBag({ ...currentBag, owned: false }) : console.log(res)
    );
  };

  return (
    <Col>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Link to={`/bags/${currentBag.bag_id}`}>
            <Card.Img variant="top" src={currentBag.photo_url} style={{ width: 254, height: 'auto' }} />
            <Card.Title>Name: {currentBag.bag_name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Price: {currentBag.price}$</Card.Subtitle>
            <Card.Text>Brand: {currentBag.brands.brand_name}</Card.Text>
          </Link>
          {currentBag.owned === true ? (
            <Button onClick={btnRemoveHandler} variant="secondary">
              Remove from collection
            </Button>
          ) : (
            <Button onClick={btnAddHandler} variant="primary">
              Add to collection
            </Button>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default BagCard;
