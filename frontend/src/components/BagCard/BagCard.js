import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { UserContext } from '../../context/userContext';
import ErrorAlert from '../ErrorAlert/ErrorAlert';
import { addBag } from '../../sources/users';

const BagCard = (props) => {
  const [userContext] = useContext(UserContext);
  const btnAddHandler = () => {
    if (props.bags.owned === false) {
      addBag(props.bags.bag_id, userContext.token).then((res) => (res.ok ? alert('success') : alert('nope')));
    } else {
      alert('Else that does not work');
      <ErrorAlert props={'You need to be logged in to add a bag'} />;
    }
  };
  const btnRemoveHandler = () => {};
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Link to={`/bags/${props.bags.bag_id}`}>
          <Card.Img variant="top" src={props.bags.photo_url} style={{ width: 254, height: 'auto' }} />
          <Card.Title>Name: {props.bags.bag_name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Price: {props.bags.price}$</Card.Subtitle>
          <Card.Text>Brand: {props.bags.brands.brand_name}</Card.Text>
        </Link>
        {props.bags.owned === true ? (
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
  );
};

export default BagCard;
