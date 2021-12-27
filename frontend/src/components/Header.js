import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { logout, userLogout } from '../redux/slices/userSlices';
import { cartReset } from '../redux/slices/cartSlice';
import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch();

  const qty = useSelector((state) => state.cart.quantity);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const headerRef = useRef();

  let lastScrollY = 30; // 設大於 0 的原因是因為發現重新整理時 window.scrollY 沒有完全等於 0(https://stackoverflow.com/questions/11486527/reload-browser-does-not-reset-page-to-top)，等於 0 會導致剛進畫面 header 就 hidden 了

  window.addEventListener('scroll', function () {
    if (window.scrollY > lastScrollY) {
      headerRef.current.classList.add('hidden');
    } else {
      headerRef.current.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;
  });

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    dispatch(logout());
    dispatch(userLogout()); // userRegister state 也要記得清掉
    dispatch(cartReset()); // 清空購物車(local storage 也要記得清)
    document.location.href = '/login'; // 如果這邊回首頁('/') 畫面會先跳轉登入頁面才回首頁(因為很多頁面會觸發 useEffect,清空 userLogin 時會導向登入頁面)，所以直接回登入頁面畫面比較順
  };

  return (
    // 這裡 headerRef 其實等同 (el) => (headerRef.current = el) (react 提供的的簡寫語法)
    <header className='fixed-top' ref={headerRef}>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          {/* https://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem 此寫法參考二樓解答 */}
          <Navbar.Brand as={NavLink} to='/'>
            倫倫の商城
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <SearchBox />
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
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='管理員' className='ms-3' id='adminmenu'>
                  <NavDropdown.Item as={NavLink} to='/admin/userlist'>
                    用戶列表
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to='/admin/productlist'>
                    商品列表
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to='/admin/orderlist'>
                    訂單列表
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
