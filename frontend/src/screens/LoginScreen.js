import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { login } from '../redux/slices/apiCalls';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, pending, error } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/'; // '/' 回到 HomeScreen

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault(); // 防止頁面 reload
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1 className='text-center'>登入</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {pending && <Loader loaderType2 />}
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>帳號</Form.Label>
          <Form.Control
            type='email'
            placeholder='Email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            required
          />
        </Form.Group>

        <Form.Group className='mb-5' controlId='password'>
          <Form.Label>密碼</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <div className='d-flex justify-content-center'>
          <Button className='btn-lg fs-6' variant='primary' type='submit'>
            登入
          </Button>
        </div>
      </Form>

      {/* 例如今天如果我們是從 CartScreen 點擊 '去買單'按鈕，因尚未登入而跳轉至登入畫面(此時登入畫面的 URL 為 /login?redirect=shipping)，而我們又是新用戶需要註冊，這時點擊註冊時，就會導向到 URL 為 /register?redirect=${redirect} 的註冊頁面 (此時的 redirect 就可以放入 shipping)
    而我們會希望註冊完直接到 ShippingScreen 來增加 UX(而不是回首頁之類的)，這時我們就可以利用 url 後面的 ?redirect=shipping(用 location.search 取得從 ? 開始的 URL（查询部分）)來做到 */}
      <Row className='py-5'>
        <Col className='text-center'>
          新用戶?{' '}
          <NavLink
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
          >
            立即註冊
          </NavLink>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
