import React,{useState} from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import products from '../products';
import Product from '../components/Product';

const HomeScreen = () => {
  const [value,setValue] = useState('所有商品')
  
  const changeValue = (e) => {
    if (e.target.tagName.toLowerCase() === 'div')
    setValue(e.target.textContent)
  } 
  // 這邊利用了Event Delegation的技巧，所以只需要在div上註冊一次點擊事件

  return (
    <Row>
      <Col className='category' as='section' lg={2}>
        <div onClick={changeValue}>
          <Card>所有商品</Card>
          <Card>手機類</Card>
          <Card>耳機類</Card>
          <Card>遊戲類</Card>
        </div>
      </Col>
      <Col as='section' lg={10}>
         <select className="form-select">
          <option value="" hidden>價格</option>
          {/* 讓價格不要進入選單選項內 */}
          <option value="價格: 低到高">價格: 低到高</option>
          <option value="價格: 高到低">價格: 高到低</option>
        </select>
        <h1 className='text-center mt-2'>{value}</h1>
        <Row>
          {/* 從小裝置到大裝置Col這塊div的個數 >> 12/12=1  6/12=2  4/12=3 */}
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default HomeScreen;

// <Row></Row> 一塊有Flex屬性 flex方向為row的div <Col></Col> 一塊有Flex屬性 flex方向為column的div
