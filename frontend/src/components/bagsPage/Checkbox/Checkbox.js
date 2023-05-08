import React, { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

const Checkbox = (num, content) => {
  const [value, setValue] = useState([]);
  const handleChange = (val) => setValue(val);

  return (
    <>
      <ToggleButtonGroup type="checkbox" value={value} onChange={handleChange}>
        {content &&
          content.map((response) => (
            <ToggleButton key={response.id} id="tbg-btn" value={response.id}>
              {response.name}
            </ToggleButton>
          ))}
        <ToggleButton id="tbg-btn-1" value={1}>
          Option 1
        </ToggleButton>
        <ToggleButton id="tbg-btn-2" value={2}>
          Option 2
        </ToggleButton>
        <ToggleButton id="tbg-btn-3" value={3}>
          Option 3
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};
export default Checkbox;
