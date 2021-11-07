import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { logout, userLogout } from '../redux/slices/userSlices';

const Header = () => {
  const dispatch = useDispatch();

  const qty = useSelector((state) => state.cart.quantity);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    dispatch(logout());
    dispatch(userLogout()); // userRegister state 也要記得清掉
    document.location.href = '/login';
  };

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
              {userInfo ? (
                <NavDropdown
                  title={userInfo.name}
                  className='ms-3'
                  id='username'
                >
                  <NavDropdown.Item as={NavLink} to='/profile'>
                    個人資料
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>
                    登出
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={NavLink} to='/login' className='ms-3'>
                  {/* 中間空位不用條CSS，直接空白鍵就行了 */}
                  <i className='fas fa-user fs-6'> 登入</i>
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
