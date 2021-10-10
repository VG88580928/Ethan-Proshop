import React from 'react';
import { Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
// Link & NavLink選擇後者，因為他附的API功能更多一點
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    // 加入minHeight讓商品卡片等高
    <Card className='my-3 p-3 rounded' style={{ minHeight: '430px' }}>
      <NavLink to={`/product/${product._id}`}>
        {/* 因為原本是a標籤會有換頁行為，把a標籤換成NavLink後，換頁就不會刷新頁面了 */}
        <Card.Img src={product.image} variant='top' />
      </NavLink>
      <Card.Body>
        <NavLink to={`/product/${product._id}`}>
          <Card.Title>
            <strong>{product.name}</strong>
          </Card.Title>
        </NavLink>
        {/* as=... 把該元素標籤變成...*/}
        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as='h4'>{`NT$ ${product.price}`}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
