import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children, center }) => {
  return (
    <Alert variant={variant} className={center ? 'text-center' : ''}>
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: 'secondary',
};

export default Message;
