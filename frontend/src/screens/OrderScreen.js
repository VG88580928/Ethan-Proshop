import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { NavLink } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { orderPayReset } from '../redux/slices/orderSlices';
import { getOrderDetails, payOrder } from '../redux/slices/apiCalls';

// 把付款放此頁面而不是下單頁面的原因
// 1. keep user cart items in the server after placing the order
// 2. track the payment status on our side in the order model after getting results from PayPal.

const OrderScreen = ({ match }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const { order, pending, error } = useSelector((state) => state.orderDetails);

  // pending 會和上面的重複命名，解構語法改命名成 pendingPay
  const { pending: pendingPay, success } = useSelector(
    (state) => state.orderPay
  );

  useEffect(() => {
    const addPaypalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');

      // 沒有 npm 可用時，動態載入 script tag to React/JSX 可參考 update 部分: https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true; // 要記得寫，不然 setSdkReady() 可能會先執行

      // 確保 script 內容載入完才執行
      script.onload = () => {
        setSdkReady(true);
      };

      document.body.appendChild(script); // 最後放到 body 最下面
    };

    // 還沒拿到 order 時發送請求 & 付款成功後也發送請求更新成付款成功頁面 & 當 order._id !== orderId 時也要更新頁面(也就是在切換不同訂單頁面時)，否則顯示的訂單都會是第一筆訂單的資料
    if (!order || success || order._id !== orderId) {
      dispatch(orderPayReset()); // 防止迴圈發生，不然 success 一直保持在 true 就會一直觸發 getOrderDetails()
      dispatch(getOrderDetails(orderId));
      // 已拿到 order 但尚未付款時，載入 paypal script，載入後 window 底下會生成 paypal 物件
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPaypalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, success, orderId]);

  const successPaymentHandler = (paymentResult) => {
    // paymentResult 是成功付款後 paypal 生成的結果
    dispatch(payOrder(orderId, paymentResult));
  };

  return pending ? (
    <Loader />
  ) : error ? (
    <div className='pt-5'>
      <Message variant='danger'>{error}</Message>
    </div>
  ) : (
    <div className='pt-5'>
      <h1>訂單 ID: {orderId}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush' className='rounded'>
            <ListGroup.Item>
              <h2>運送資訊</h2>
              <p>
                <strong>姓名: </strong> {order.user.name}
              </p>
              <p>
                <strong>信箱: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>地址: </strong>({order.shippingAddress.country})
                {order.shippingAddress.city}
                {order.shippingAddress.address}
                <span className='ms-3'>
                  郵遞區號:{order.shippingAddress.postalCode}
                </span>
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  已配送 時間: {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>尚未交付</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>付款方式</h2>
              <p>
                <strong>方式: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  已付款 付款時間: {order.paidAt}
                </Message>
              ) : (
                <Message variant='danger'>付款狀態: 尚未付款</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>訂單項目</h2>
              {!order.orderItems.length ? (
                <Message>訂單是空的哦!</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item) => (
                    <ListGroup.Item key={item._id}>
                      <Row className='align-items-center'>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <NavLink to={`/product/${item._id}`}>
                            {item.name}
                          </NavLink>
                        </Col>
                        <Col md={4}>
                          {item.quantity} x {item.price} = $
                          {(item.price * item.quantity).toFixed(2)}
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
                  <Col>{formatter.format(order.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>運費(滿三百免運)</Col>
                  <Col>{formatter.format(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>稅額(5%)</Col>
                  <Col>{formatter.format(order.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>總計</Col>
                  <Col>{formatter.format(order.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>

              {/* 這邊會出現一些錯誤，是因為 paypal 有些功能只提供 US 地區，像是這裡會有個按鈕無法出現而在 console 報錯，是正常現象 */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {pendingPay && <Loader loaderType2 />}
                  {!sdkReady ? (
                    <Loader loaderType2 />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
