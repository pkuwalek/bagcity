import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useParams } from 'react-router-dom';
import { getBagById } from '../../sources/bags';
import './bagPage.scss';

const BagPage = () => {
  const { id } = useParams();
  const [singleBag, setSingleBag] = useState({ brands: {}, colors: {}, types: {} });

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
        </Col>
      </Row>
    </Container>
  );
};
export default BagPage;
