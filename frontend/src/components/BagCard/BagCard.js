import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const BagCard = (props) => {
  const btnHandler = () => {};
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Link to={`/bags/${props.bags.bag_id}`}>
          <Card.Img variant="top" src={props.bags.photo_url} style={{ width: 254, height: 'auto' }} />
          <Card.Title>Name: {props.bags.bag_name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Price: {props.bags.price}$</Card.Subtitle>
          <Card.Text>Brand: {props.bags.brands.brand_name}</Card.Text>
        </Link>
        <Button onClick={btnHandler} variant="primary">
          Add bag
        </Button>
      </Card.Body>
    </Card>
  );
};

export default BagCard;
