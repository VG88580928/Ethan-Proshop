import React from 'react';
import { Card } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'; // Link & NavLink選擇後者，因為他附的API功能更多一點
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    // 加入minHeight讓商品卡片等高，庫存為 0 時顯示已售完圖示
    // 把 sellout::before 放在 div 而不是 image 上是因為 ::before 無法用在 image 上 (來源: https://stackoverflow.com/questions/5843035/does-before-not-work-on-img-elements/5843164#5843164)
    <Card
      className={`my-3 p-3 rounded ${
        product.countInStock === 0 ? 'sellout' : ''
      }`}
      style={{ minHeight: '430px' }}
    >
      <NavLink
        className='product__mask__relative'
        to={`/product/${product._id}`}
      >
        {/* 因為原本是 a 標籤會有換頁行為，把 a 標籤換成 NavLink 後，換頁就不會刷新頁面了 */}
        <Card.Img src={product.image} variant='top' />
        <div className='mask d-flex justify-content-center align-items-center'>
          <h2>查看更多</h2>
        </div>
      </NavLink>
      <Card.Body>
        <NavLink to={`/product/${product._id}`}>
          <Card.Title>
            <strong>{product.name}</strong>
          </Card.Title>
        </NavLink>
        {/* as=... 把該元素標籤變成...*/}
        <Card.Text as='div'>
          <Rating value={product.rating} text={` ${product.numReviews} 評價`} />
        </Card.Text>
        <Card.Text as='h4'>{`$${product.price}`}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
