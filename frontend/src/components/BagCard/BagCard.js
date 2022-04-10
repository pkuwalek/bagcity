import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const BagCard = (props) => {
    return (
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Link to={`/bags/${props.bags.bag_id}`}>
            <Card.Title>Name: {props.bags.bag_name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Price: {props.bags.price}$</Card.Subtitle>
            <Card.Text>Brand: {props.bags.brands.brand_name}</Card.Text>
            </Link>
        </Card.Body>
        </Card>
    )
};

export default BagCard;