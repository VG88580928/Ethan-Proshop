import React from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Navbar.Brand as={NavLink} to='/'>
            倫倫の商城
          </Navbar.Brand>
          {/* https://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem 此寫法參考二樓解答 */}
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <Nav.Link as={NavLink} to='/cart'>
                <i className='fas fa-shopping-cart fs-6'> 購物車</i>
              </Nav.Link>
              <Nav.Link as={NavLink} to='/login'>
                <i className='fas fa-user fs-6'> 登入</i>
                {/* 中間空位不用條CSS，直接空白鍵就行了 */}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
