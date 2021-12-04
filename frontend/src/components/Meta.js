import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description}></meta>
      <meta name='keywords' content={keywords}></meta>
    </Helmet>
  );
};

Meta.defaultProps = {
  title: '倫倫の商城',
  description: '最棒的3C產品!',
  keywords: '3C產品,高CP值3C產品',
};

export default Meta;
