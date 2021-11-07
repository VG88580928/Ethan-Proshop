import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../redux/slices/apiCalls';

const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { user, loading, error } = userDetails;

  const { userInfo } = useSelector((state) => state.userLogin); // 看看用戶是否登入

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile); // 看看用戶是否登入
  const { success } = userUpdateProfile;

  const updateError = userUpdateProfile.error;

  useEffect(() => {
    // 若用戶沒登入無法進入此 protected route
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'));
      } else {
        setName(user.name);
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
        {loading && <Loader />}
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
      </Col>
    </Row>
  );
};
export default ProfileScreen;
