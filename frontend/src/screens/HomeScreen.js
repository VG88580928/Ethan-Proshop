import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // 優化過去的 connect 寫法
import { Col, Row, Card } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { requestProducts } from '../actions/productActions';

const HomeScreen = () => {
  const [value, setValue] = useState('所有商品');
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.requestProducts);
  const { products, error } = productList;

  useEffect(() => {
    dispatch(requestProducts());
  }, [dispatch]);

  const changeValue = (e) => {
    if (e.target.tagName === 'DIV' && e.target.className === 'card')
      /* 這邊多檢查了e.target.className === 'card'是因為發現原本點到商品種類的間格區塊，
     會直接把所有value印到畫面上(變這樣 =>'所有商品手機類耳機類遊戲類') */
      setValue(e.target.textContent);
  };
  // 這邊利用了Event Delegation的技巧，所以只需要在div上註冊一次點擊事件

  return (
    <Row className='pt-5'>
      {/* 原本用 isPending 的 Boolean 值做 Loading,但發現進商品頁面後再回到主頁又會重複跑 Loading,個人覺得沒有必要做多餘的 Loading 畫面(因為商品早在第一次進網站時就載入完了)
      ，因此刪除 isPending 改用 products.length 做動態渲染來增加 UX(使用者體驗)*/}
      {products.length === 0 ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <Col className='category' as='section' lg={2}>
            <div onClick={changeValue}>
              <Card>所有商品</Card>
              <Card>手機類</Card>
              <Card>耳機類</Card>
              <Card>遊戲類</Card>
            </div>
          </Col>
          <Col as='section' lg={10}>
            <select className='form-select'>
              <option value='' hidden>
                價格
              </option>
              {/* 讓價格不要進入選單選項內 */}
              <option value='價格: 低到高'>價格: 低到高</option>
              <option value='價格: 高到低'>價格: 高到低</option>
            </select>
            <h1 className='text-center mt-2'>{value}</h1>
            <Row>
              {/* 從小裝置到大裝置Col這塊div的個數 >> 12/12=1  6/12=2  4/12=3 */}
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          </Col>{' '}
        </>
      )}
    </Row>
  );
};

export default HomeScreen;

// <Row></Row> 一塊有Flex屬性 flex方向為row的div <Col></Col> 一塊有Flex屬性 flex方向為column的div
