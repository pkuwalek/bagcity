import React, { useState } from 'react';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import './checkbox.scss';

const Checkbox = ({ content, name, currentValue, valueSetter }) => {
  const handleChange = (val) => {
    valueSetter(val);
    console.log(val);
  };

  return (
    <>
      <ToggleButtonGroup type="checkbox" value={currentValue} onChange={handleChange} vertical>
        {content &&
          content.map((response) => (
            <ToggleButton key={`${name}${response.id}`} id={`tbg-btn-${name}-${response.id}`} value={response.id}>
              {response.name} {response.id}
            </ToggleButton>
          ))}
      </ToggleButtonGroup>
    </>
  );
};
export default Checkbox;
