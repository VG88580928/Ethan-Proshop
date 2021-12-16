import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-4'>
            COPYRIGHT &copy; 2021 Ethan's ProShop
            <p style={{ marginBottom: 0 }}>
              本站僅用於個人學習使用，無商業用途
              <a
                href='https://github.com/VG88580928/Ethan-Proshop'
                rel='noreferrer noopener' // 加上這個為了增加安全性 https://pjchender.blogspot.com/2020/05/relnoreferrer-targetblank.html
                target='_blank'
              >
                <i className='fab fa-github ms-1'></i>
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
