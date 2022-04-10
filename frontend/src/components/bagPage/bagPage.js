import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBagById } from '../../sources/bags';
import './bagPage.scss';

const BagPage = () => {
  let { id } = useParams();
  const [singleBag, setSingleBag] = useState({brands: {}, colors: {}, types: {}});

  useEffect(() => {
    getBagById(id)
    .then((response) => response.json())
    .then((response_json) => setSingleBag(response_json))
    .catch((error) => console.error(error))
  }, [id])

    return (
    <>
    <h1>The Bag:</h1>
        <div>
          <h2>Bag name:</h2>
          <p>{singleBag.bag_name}</p>
          <h2>Brand:</h2>
          <p>{singleBag.brands.brand_name}</p>
          <h2>Price:</h2>
          <p>{singleBag.price}</p>
          <h2>Photo:</h2>
          <img src={singleBag.photo_url} alt='bag'></img>
          <h2>Color:</h2>
          <p>{singleBag.colors.color_name}</p>
          <h2>Type:</h2>
          <p>{singleBag.types.type_name}</p>
          <h2>Description:</h2>
          <p>{singleBag.description}</p>
        </div>
    </>
    )
};
export default BagPage;