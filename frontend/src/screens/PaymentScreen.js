import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../redux/slices/cartSlice';

const PaymentScreen = ({ history }) => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userLogin);

  if (!shippingAddress) {
    history.push('/shipping'); // 還沒填寫完地址時無法進入
  }

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
  }, [userInfo, history]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(savePaymentMethod(paymentMethod));

    history.push('/placeorder');
  };

  return (
    <FormContainer>
      {/* step1 是 step1 = true 的簡寫，把 true 作為 prop 傳入 CheckoutSteps component */}
      <CheckoutSteps step1 step2 />
      <h1 className='text-center'>付款方式</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group as='fieldset'>
          <Form.Label as='legend' className='mb-3'>
            選擇方法
          </Form.Label>
          <Form.Check
            type='radio'
            label='PayPal or Credit Card'
            id='PayPal'
            name='paymentMethod'
            value='PayPal'
            checked
            onChange={(e) => setPaymentMethod(e.target.value)}
          ></Form.Check>
        </Form.Group>

        <div className='d-flex justify-content-center mt-4'>
          <Button type='submit' variant='primary'>
            下一步
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
