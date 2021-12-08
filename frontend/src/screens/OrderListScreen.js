import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { listOrders } from '../redux/slices/apiCalls';

const OrderListScreen = ({ history }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userLogin);
  const { orders, error, pending } = useSelector((state) => state.orderList);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders());
    } else {
      history.push('/login');
    }
  }, [dispatch, userInfo, history]);

  return (
    <div className='user-list pt-5'>
      <Meta />
      <h1>所有訂單</h1>
      {pending ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>用戶</th>
              <th>日期</th>
              <th>金額</th>
              <th>付款</th>
              <th>配送</th>
              <th className='text-center'></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
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
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      className='btn btn-info btn-sm'
                      as={NavLink}
                      to={`/order/${order._id}`}
                    >
                      詳細
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OrderListScreen;
