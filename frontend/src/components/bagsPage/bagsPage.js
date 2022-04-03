import React, { useEffect, useState } from 'react';
import { getAllBags } from '../../sources/bags';
import BagCard from '../BagCard/BagCard';

const BagsPage = () => {
  const [allBags, setAllBags] = useState([]);

  useEffect(() => {
    getAllBags()
    .then((response) => response.json())
    .then((response_json) => setAllBags(response_json))
    .catch((error) => console.error(error))
  }, [])

    return (
    <>
    <h1>Bags:</h1>
        <div>
            <div>
              {/* <p>{allBags && JSON.stringify(allBags, null, 4)}</p> */}
              <p>Name</p>
              {/* <p>{allBags.map(response => <li key={response.bag_id}>{response.bag_name}</li>)}</p> */}
            </div>
            <div>
              <span>{allBags.map(response => <BagCard key={response.bag_id} bags={response} />)}</span>
            </div>
        </div>
    </>
    )
};
export default BagsPage;