import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <Nav className='checkoutSteps justify-content-center pt-4'>
      {/* 利用 data-*attribute 顯示步驟 1 > 2 > 3 */}
      <Nav.Item data-number='1'>
        {step1 ? (
          <Nav.Link as={NavLink} to='/shipping'>
            運送地址
          </Nav.Link>
        ) : (
          <Nav.Link disabled>運送地址</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item data-number='2'>
        {step2 ? (
          <Nav.Link as={NavLink} to='/payment'>
            付款方式
          </Nav.Link>
        ) : (
          <Nav.Link disabled>付款方式</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item data-number='3'>
        {step3 ? (
          <Nav.Link as={NavLink} to='/placeorder'>
            送出訂單
          </Nav.Link>
        ) : (
          <Nav.Link disabled>送出訂單</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
