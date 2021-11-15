import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../redux/slices/apiCalls';
import Loader from '../components/Loader';
import { orderCreateReset } from '../redux/slices/orderSlices';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();

  const { products, shippingAddress, paymentMethod } = useSelector(
    (state) => state.cart
  );

  // 處理金額格式 (Intl) ECMAScript Internationalization API (只有 IE 不支援) 來源: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#browser_compatibility
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  // 價錢計算
  const addDecimals = (num) => {
    return num.toFixed(2); // toFixed 返回 string ex: 25.2.toFixed(2) would return '25.20',要注意如果把'25.20'執行 Number('25.20'),尾數 0 會被自動移除)
  };

  const itemsPrice = addDecimals(
    products.reduce((acc, product) => {
      return acc + product.quantity * product.price;
    }, 0)
  );

  const shippingPrice = addDecimals(itemsPrice >= 300 ? 0 : 10); // 滿三百免運

  const taxPrice = addDecimals(itemsPrice * 0.05);

  const totalPrice = addDecimals(
    Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice) // 記得轉成數字,因為被 toFixed(2) 後數字都轉成 string 了，直接加起來會出事
  );

  const { order, success, error, pending } = useSelector(
    (state) => state.orderCreate
  );

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`); // order._id 是創建 orders collection 時自動生成的 _id
      dispatch(orderCreateReset()); // 創建完要記得 reset orderCreate,不然 success 一直保持在 true 的話，創完第一筆訂單要再創第二筆訂單時，進此頁面會直接被導向 orderScreen(並留下剛剛上筆訂單的內容) 而無法創建新訂單
    } else if (!userInfo) {
      history.push('/login');
    }
  }, [dispatch, history, success, order, userInfo]);

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
                          <NavLink to={`/product/${product._id}`}>
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
                  <Col>{formatter.format(itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>運費(滿三百免運)</Col>
                  <Col>{formatter.format(shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>稅額(5%)</Col>
                  <Col>{formatter.format(taxPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>總計</Col>
                  <Col>{formatter.format(totalPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                {/* 這裡很重要，如果沒設置這個 loader，如果有人在創建訂單的時間內點擊數次，就會創建多組相同訂單 */}
                {pending ? (
                  <Loader loaderType2 />
                ) : (
                  <div className='d-grid'>
                    <Button
                      className='fs-5'
                      type='button'
                      disabled={!products.length}
                      onClick={placeOrderHandler}
                    >
                      創建訂單
                    </Button>
                  </div>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlaceOrderScreen;
