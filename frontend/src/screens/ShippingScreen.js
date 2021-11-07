import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../redux/slices/cartSlice';

const ShippingScreen = ({ history }) => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userLogin);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
  }, [userInfo, history]);

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({ address, city, postalCode, country }));

    history.push('/payment');
  };
  return (
    <FormContainer>
      <CheckoutSteps step1 />
      <h1 className='text-center'>運送地址</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mb-3' controlId='country'>
          <Form.Label>國家</Form.Label>
          <Form.Control
            type='text'
            placeholder='Country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='city'>
          <Form.Label>縣(市)</Form.Label>
          <Form.Control
            type='text'
            placeholder='City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='address'>
          <Form.Label>地址</Form.Label>
          <Form.Control
            type='text'
            placeholder='Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoFocus
            required
          />
        </Form.Group>

        <Form.Group className='mb-4' controlId='postalCode'>
          <Form.Label>郵遞區號</Form.Label>
          <Form.Control
            type='text'
            placeholder='Postal code'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </Form.Group>

        <div className='d-flex justify-content-center'>
          <Button type='submit' variant='primary'>
            下一步
          </Button>
        </div>
      </Form>
    </FormContainer>
  );
};

export default ShippingScreen;
