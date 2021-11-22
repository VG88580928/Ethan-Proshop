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
    dispatch(listMyOrders()); // 確保每次進頁面都取得最新 orders

    // 若用戶沒登入無法進入此 protected route
    if (!userInfo) {
      history.push('/login');

      // userInfo._id !== user._id 確保當我是 admin 時，去到 userEditScreen 時 userDetails 變成別的 user，回來此頁面時可以更新
    } else if (!user.name || userInfo._id !== user._id) {
      dispatch(getUserDetails('profile')); // server 有兩個 API 一支提供一般用戶獲取用戶資訊(GET /api/users/profile)，另一支是管理員專用(GET /api/users/:id)
      // dispatch(listMyOrders()); 原本寫在這邊，但發現問題 -> 首次進個資頁面訂單會更新，但此時直接再去下訂第二筆訂單後，再進個人資料頁面時會發現第二筆訂單沒有更新到(因為第一次進訂單頁面後我們會拿到 user.name,而 user.name 在第二次進個資頁面時會保持 true 就不更新 order 了。
    } else {
      // 進頁面拿到 user 資料後在更新個資欄位自動填入 user 姓名和信箱
      setName(user.name);
      setEmail(user.email);
    }
    // 原本偷懶直接把 user object 當成依賴寫進去，結果出現無窮迴圈，因此把 user 拆成 user.name && user.email && user._id (參考資料: https://dmitripavlutin.com/react-useeffect-infinite-loop/ 的 2.1 Avoid objects as dependencies)
  }, [dispatch, userInfo, history, user.name, user.email, user._id]);

  const submitHandler = (e) => {
    e.preventDefault(); // 防止頁面 reload
    if (password !== confirmPassword) {
      setMessage('密碼不匹配');
    } else {
      dispatch(
        // name.trim() 防止有人名字前後打一堆空白鍵 or 只打一堆空白鍵
        updateUserProfile({ id: user._id, name: name.trim(), email, password })
      );
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
                <th>創建</th>
                <th>金額</th>
                <th>付款</th>
                <th>配送</th>
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
                      `${order.deliveredAt.substring(0, 10)}`
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </td>
                  <td>
                    <Button
                      className='btn btn-info btn-sm'
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
