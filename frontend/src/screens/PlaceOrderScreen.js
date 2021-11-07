import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../redux/slices/apiCalls';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const { products, shippingAddress, paymentMethod } = useSelector(
    (state) => state.cart
  );

  // 價錢計算

  // ECMAScript Internationalization API (只有 IE 不支援) 來源: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#browser_compatibility
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const addDecimals = (num) => {
    return num.toFixed(2); // toFixed 回傳 string ex: 25.2.toFixed(2) would return '25.20',要注意如果把 '25.20' 執行 Number('25.20'),尾數 0 會被自動移除)
  };

  const itemsPrice = addDecimals(
    products.reduce((acc, product) => {
      return acc + product.quantity * product.price;
    }, 0)
  );

  const shippingPrice = addDecimals(itemsPrice >= 300 ? 0 : 10); // 滿三百免運

  const taxPrice = addDecimals(Number(itemsPrice * 0.05));

  const totalPrice = addDecimals(
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)
  );

  // 處理金額格式 (Intl)
  const formattedItemsPrice = formatter.format(itemsPrice);
  const formattedShippingPrice = formatter.format(shippingPrice);
  const formattedTaxPrice = formatter.format(taxPrice);
  const formattedTotalPrice = formatter.format(totalPrice);

  const { order, success, error } = useSelector((state) => state.orderCreate);

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`); // order._id 是創建 orders collection 時自動生成的 _id
    }
  }, [history, success, order]);

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: products,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <div className='pt-5'>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush' className='rounded'>
            <ListGroup.Item>
              <h2>運送方式</h2>
              <p>
                <strong>地址: </strong>({shippingAddress.country})
                {shippingAddress.city}
                {shippingAddress.address}
                <span className='ms-3'>
                  郵遞區號:{shippingAddress.postalCode}
                </span>
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>付款方式</h2>
              <p>
                <strong>方式: </strong>
                {paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>訂單項目</h2>
              {!products.length ? (
                <Message>您的購物車目前沒有商品哦</Message>
              ) : (
                <ListGroup variant='flush'>
                  {products.map((product) => (
                    <ListGroup.Item key={product._id}>
                      <Row className='align-items-center'>
                        <Col md={2}>
                          <Image
                            src={product.image}
                            alt={product.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <NavLink to={`/product/${product.product}`}>
                            {product.name}
                          </NavLink>
                        </Col>
                        <Col md={4}>
                          {product.quantity} x {product.price} = $
                          {(product.price * product.quantity).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>訂單摘要</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>項目</Col>
                  <Col>{formattedItemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>運費(滿三百免運)</Col>
                  <Col>{formattedShippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>稅額(5%)</Col>
                  <Col>{formattedTaxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>總計</Col>
                  <Col>{formattedTotalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <div className='d-grid'>
                  <Button
                    className='fs-5'
                    type='button'
                    disabled={!products.length}
                    onClick={placeOrderHandler}
                  >
                    送出訂單
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
