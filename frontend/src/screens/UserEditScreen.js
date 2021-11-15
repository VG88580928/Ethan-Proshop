import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { userUpdateReset } from '../redux/slices/userSlices';
import { getUserDetails, updateUser } from '../redux/slices/apiCalls';

const UserEditScreen = ({ match, history }) => {
  const userId = match.params.id; // 取得 url 上的 id

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const { pending, error, user } = useSelector((state) => state.userDetails);
  const {
    pending: pendingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.userUpdate);

  useEffect(() => {
    if (successUpdate) {
      dispatch(userUpdateReset());
      history.push('/admin/userlist');
    } else {
      if (!user.name || user._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, userId, user, successUpdate, history]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateUser({
        _id: userId,
        name: name.trim(),
        email,
        isAdmin,
      })
    );
  };

  return (
    <div className='pt-2'>
      <FormContainer>
        <NavLink
          to='/admin/userlist'
          className='btn btn-outline-secondary my-3'
        >
          返回
        </NavLink>
        <h1 className='text-center'>編輯用戶</h1>
        {pendingUpdate && <Loader loaderType2 />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {pending ? (
          <Loader loaderType2 />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
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

            <Form.Group className='mb-3' controlId='isadmin'>
              <Form.Check
                type='checkbox'
                label='管理員'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            </Form.Group>

            <div className='d-flex justify-content-center'>
              <Button className='btn-lg fs-6' variant='primary' type='submit'>
                更新
              </Button>
            </div>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default UserEditScreen;
