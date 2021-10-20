import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '50px',
        height: '50px',
        display: 'block',
        margin: 'auto',
      }}
    >
      {/* 供視障人士(screen reader)閱讀 */}
      <span className='visually-hidden'>Loading...</span>
    </Spinner>
  );
};

export default Loader;
