import React, { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import './checkbox.scss';

const Checkbox = ({ content }) => {
  const [value, setValue] = useState([]);
  const handleChange = (val) => setValue(val);

  return (
    <>
      <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange} vertical>
        {content &&
          content.map((response) => (
            <ToggleButton key={response.id} id="tbg-btn" value={response.id}>
              {response.name}
            </ToggleButton>
          ))}
      </ToggleButtonGroup>
    </>
  );
};
export default Checkbox;
