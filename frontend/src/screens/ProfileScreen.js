import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  getUserDetails,
  updateUserProfile,
  listMyOrders,
} from '../redux/slices/apiCalls';

const ProfileScreen = ({ location, history }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const { user, pending, error } = useSelector((state) => state.userDetails);

  const { userInfo } = useSelector((state) => state.userLogin); // 用來查看用戶是否登入

  const { success, error: updateError } = useSelector(
    (state) => state.userUpdateProfile
  );

  const {
    orders,
    pending: myOrdersPending,
    error: myOrdersError,
  } = useSelector((state) => state.myOrderList);

  useEffect(() => {
    // 若用戶沒登入無法進入此 protected route
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'));
        dispatch(listMyOrders());
      } else {
        setName(user.name); // 進頁面拿到 user 資料後在更新個資欄位自動填入 user 姓名和信箱
        setEmail(user.email);
      }
    }
  }, [dispatch, userInfo, history, user]);

  const submitHandler = (e) => {
    e.preventDefault(); // 防止頁面 reload
    if (password !== confirmPassword) {
      setMessage('密碼不匹配');
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <Row className='pt-5'>
      <Col md={3}>
        <h2 className='text-center'>個人資料</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {updateError && (
          <Message variant='danger'>該帳號已經有人使用囉!</Message>
        )}
        {success && <Message variant='success'>資料更新成功!</Message>}
        {pending && <Loader loaderType2 />}
        <Form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='name'>
            <Form.Label>姓名</Form.Label>
            <Form.Control
              type='name'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='email'>
            <Form.Label>帳號</Form.Label>
            <Form.Control
              type='email'
              placeholder='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='password'>
            <Form.Label>密碼</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-5' controlId='confirmPassword'>
            <Form.Label>確認密碼</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <div className='d-flex justify-content-center'>
            <Button className='btn-lg fs-6' variant='primary' type='submit'>
              更新資料
            </Button>
          </div>
        </Form>
      </Col>
      <Col md={9}>
        <h2 className='text-center'>我的訂單</h2>
        {myOrdersPending ? (
          <Loader loaderType2 />
        ) : myOrdersError ? (
          <Message variant='danger'>{myOrdersError}</Message>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>訂單 ID</th>
                <th>創建日期</th>
                <th>總金額</th>
                <th>付款日期</th>
                <th>運送日期</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{formatter.format(order.totalPrice)}</td>
                  <td>
                    {order.isPaid ? (
                      `${order.paidAt.substring(0, 10)}`
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      `${order.deliveredAt.substring(0, 10)} 抵達`
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <Button
                      class='btn btn-info btn-sm'
                      as={NavLink}
                      to={`/order/${order._id}`}
                    >
                      詳細
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};
export default ProfileScreen;
