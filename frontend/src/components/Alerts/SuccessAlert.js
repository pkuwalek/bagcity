import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function SuccessAlert(props) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="success" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Hurray!</Alert.Heading>
        <p>{props.message}</p>
      </Alert>
    );
  }
}

export default SuccessAlert;
