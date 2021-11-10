import React from 'react';
import { Spinner } from 'react-bootstrap';

// 分成兩種 Loader,第一種是全畫面 Loader(在畫面正中間)，第二種是畫面局部的 Loader
const Loader = ({ loaderType2 }) => {
  return loaderType2 ? (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '60px',
        height: '60px',
        margin: 'auto',
        display: 'block',
      }}
    >
      <span className='visually-hidden'>Loading...</span>
    </Spinner>
  ) : (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '50px',
        height: '50px',
        display: 'block',
        // 固定 & 置中
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        margin: 'auto',
      }}
    >
      {/* 供視障人士(screen reader)閱讀 */}
      <span className='visually-hidden'>Loading...</span>
    </Spinner>
  );
};

export default Loader;
