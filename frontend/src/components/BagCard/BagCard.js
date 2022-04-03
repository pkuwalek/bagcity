import React from 'react';
import Card from 'react-bootstrap/Card';

const BagCard = (props) => {
    console.log(props);
    return (
        <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title>Name: {props.bags.bag_name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Price: {props.bags.price}$</Card.Subtitle>
            <Card.Text>
            Brand: {props.bags.brands.brand_name}
            </Card.Text>
        </Card.Body>
        </Card>
    )
};

export default BagCard;