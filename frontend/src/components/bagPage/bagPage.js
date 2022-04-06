import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBagById } from '../../sources/bags';

const BagPage = () => {
  let { id } = useParams();
  const [singleBag, setSingleBag] = useState([]);

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
            <div>
              {/* <p>{allBags && JSON.stringify(allBags, null, 4)}</p> */}
              <p>and id is: { id } </p>
              {/* <p>{allBags.map(response => <li key={response.bag_id}>{response.bag_name}</li>)}</p> */}
            </div>
            <div>
              <p>{singleBag && JSON.stringify(singleBag, null, 4)}</p>
              {/* <span>{singleBag.map(response => <li key={response.bag_id}>{response.bag_name}</li>)}</span> */}
            </div>
        </div>
    </>
    )
};
export default BagPage;