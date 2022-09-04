import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function ErrorAlert(props) {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Something went wrong</Alert.Heading>
        <p>{props.error}</p>
      </Alert>
    );
  }
}

export default ErrorAlert;
