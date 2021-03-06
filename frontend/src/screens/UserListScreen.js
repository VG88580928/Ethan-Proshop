import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Table, Button, Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { userDeleteReset } from '../redux/slices/userSlices';
import { listUsers, deleteUser } from '../redux/slices/apiCalls';

const UserListScreen = ({ history }) => {
  const [showModal, setShowModal] = useState(false);

  const [deleteId, setDeleteId] = useState('');

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userLogin);
  const { users, error, pending } = useSelector((state) => state.userList);
  const { success } = useSelector((state) => state.userDelete);

  useEffect(() => {
    dispatch(userDeleteReset()); // 要記得 reset,不然連續刪兩個 user,第二次刪畫面不會更新
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      history.push('/login');
    }
  }, [dispatch, userInfo, history, success]);

  const showModalHandler = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };
  const closeModalHandler = () => setShowModal(false);

  const deleteHandler = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div className='user-list pt-5'>
      <Meta />
      <h1>所有用戶</h1>
      {pending ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>信箱</th>
              <th className='text-center'>管理員</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {user.isAdmin ? (
                      <i
                        className='fas fa-check'
                        style={{ color: 'green' }}
                      ></i>
                    ) : (
                      <i className='fas fa-times' style={{ color: 'red' }}></i>
                    )}
                  </div>
                </td>
                <td>
                  <Button
                    className='me-2'
                    variant='dark'
                    as={NavLink}
                    to={`/admin/user/${user._id}/edit`}
                    disabled={userInfo._id === user._id} // 如果是本人，就無法編輯，不然有可能發生自己把自己管理員的身分改掉，結果就失去管理員身分，近不來這個頁面了 XD
                  >
                    <i className='fas fa-edit'></i>
                  </Button>
                  <Button
                    variant='danger'
                    disabled={userInfo._id === user._id} // 如果是本人，就無法按刪除鍵，這樣管理員就無法刪除自己
                    onClick={() => showModalHandler(user._id)}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>

                  <Modal show={showModal} onHide={closeModalHandler}>
                    <Modal.Body>確定要刪除此用戶嗎?</Modal.Body>
                    <Modal.Footer>
                      <Button
                        className='fs-5'
                        variant='secondary'
                        onClick={closeModalHandler}
                      >
                        取消
                      </Button>
                      <Button
                        className='fs-5'
                        variant='primary'
                        onClick={() => {
                          deleteHandler(deleteId);
                          closeModalHandler();
                        }}
                      >
                        刪除
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListScreen;
