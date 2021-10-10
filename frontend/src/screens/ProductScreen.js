import React from 'react';
import { NavLink } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import products from '../products';

const ProductScreen = ({ match }) => {
  // 接收props集合(match、location、history、staticContext等),由Route提供的屬性
  const product = products.find((product) => product._id === match.params.id);
  return (
    <>
      <NavLink className='btn btn-outline-secondary my-3' to='/' exact>
        返回
      </NavLink>
      {/* 這邊一定要加exact，否則返回鍵會一直處在active的狀態 */}
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
          {/* fluid = max-with:100% height:auto 讓圖片能鎖在Col這個container內 */}
        </Col>
        <Col md={3}>
          <ListGroup>
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={` ${product.numReviews} 人評價`}
              ></Rating>
            </ListGroup.Item>
            <ListGroup.Item> NT$ {product.price}</ListGroup.Item>
            <ListGroup.Item>
              <div>【商品敘述】:</div> {product.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col>售價:</Col>
                  <Col>
                    <strong>NT${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>狀態</Col>
                  <Col>{product.countInStock ? '供貨中' : '已售完'}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  disabled={product.countInStock === 0}
                  className='w-100 fs-6'
                >
                  {/* 售完商品無法加入購物車 */}
                  加入購物車
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
