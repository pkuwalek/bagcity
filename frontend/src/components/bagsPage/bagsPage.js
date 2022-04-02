import React, { useEffect, useState } from 'react';
import { getAllBags } from '../../sources/bags';

const BagsPage = () => {
  const [allBags, setAllBags] = useState('');

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
              <p>Name</p>
              <p>{allBags && JSON.stringify(allBags, null, 4)}</p>
              {/* <p>{getAllBags.map(response => <li key={response.bag_id}>{response.bag_name}</li>)}</p> */}
            </div>
            <div>
              <p>Id</p>
              {/* <p>{getAllBags.bag_id}</p> */}
            </div>
        </div>
    </>
    )
};
export default BagsPage;