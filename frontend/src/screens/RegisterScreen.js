import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../redux/slices/apiCalls';

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const { userInfo, loading, error } = useSelector(
    (state) => state.userRegister
  );

  const redirect = location.search ? location.search.split('=')[1] : '/'; // '/' 回到 HomeScreen

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitHandler = (e) => {
    e.preventDefault(); // 防止頁面 reload
    if (password !== confirmPassword) {
      setMessage('密碼不匹配');
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1 className='text-center'>註冊</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='name'>
          <Form.Label>姓名</Form.Label>
          <Form.Control
            type='name'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='email'>
          <Form.Label>帳號</Form.Label>
          <Form.Control
            type='email'
            placeholder='Email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='password'>
          <Form.Label>密碼</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className='mb-5' controlId='confirmPassword'>
          <Form.Label>確認密碼</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className='d-flex justify-content-center'>
          <Button className='btn-lg fs-6' variant='primary' type='submit'>
            註冊
          </Button>
        </div>
      </Form>

      {/* 例如今天如果我們是從 CartScreen 點擊 '去買單'按鈕，因尚未登入而跳轉至登入畫面(此時登入畫面的 URL 為 /login?redirect=shipping)，而我們又是新用戶需要註冊，這時點擊註冊時，就會導向到 URL 為 /register?redirect=${redirect} 的註冊頁面 (此時的 redirect 就可以放入 shipping)
    而我們會希望註冊完直接到 ShippingScreen 來增加 UX(而不是回首頁之類的)，這時我們就可以利用 url 後面的 ?redirect=shipping(在 ShippingScreen 用 location.search 取得從 ? 開始的 URL（查询部分）)來做到 */}
      <Row className='py-5'>
        <Col className='text-center'>
          有會員帳號了嗎?{' '}
          <NavLink to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            登入
          </NavLink>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
