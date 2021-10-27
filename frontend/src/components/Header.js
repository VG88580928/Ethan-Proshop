import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  const qty = useSelector((state) => state.cart.quantity);

  return (
    <header className='fixed-top'>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          {/* https://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem 此寫法參考二樓解答 */}
          <Navbar.Brand as={NavLink} to='/'>
            倫倫の商城
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link as={NavLink} to='/cart' className='cart-link'>
                <i className='fas fa-shopping-cart fs-6'></i>
                <span>
                  購物車<span className='cart-badge'>{qty}</span>
                </span>
              </Nav.Link>
              <Nav.Link as={NavLink} to='/login'>
                {/* 中間空位不用條CSS，直接空白鍵就行了 */}
                <i className='fas fa-user fs-6'> 登入</i>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
