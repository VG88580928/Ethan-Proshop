import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // 優化過去 connect 的寫法
import { Col, Row, Card } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { requestProducts } from '../redux/actions/productActions';

const HomeScreen = () => {
  const [value, setValue] = useState('所有商品');

  const divRef = useRef();

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.requestProducts);

  const { products, error } = productList;

  useEffect(() => {
    dispatch(requestProducts());
  }, [dispatch]);

  const changeValue = (e) => {
    /* 這邊多檢查了 e.target.className === 'card' 是因為發現原本點到商品種類的間格區塊，
     會直接把所有 value 印到畫面上(變這樣 =>'所有商品手機類耳機類遊戲類') */
    // 這邊利用了 Event Delegation 的技巧，所以只需要在 div 上註冊一次點擊事件
    if (e.target.tagName === 'DIV' && e.target.className === 'card')
      setValue(e.target.textContent);
  };

  const active = (e) => {
    const divs = divRef.current.querySelectorAll('.card'); // 不要寫成 document.querySelectorAll('.category .card')，你抓了 document 會抓到其他 components，可能導致非預期的 bugs(參考:https://stackoverflow.com/questions/57556673/react-ref-and-query-selector-all)
    divs.forEach((div) => div.classList.remove('active'));
    if (e.target.tagName === 'DIV' && e.target.className === 'card') {
      e.target.classList.add('active');
    }
  };

  return (
    <Row className='pt-5'>
      {/* 原本用 isPending 的 Boolean 值做 Loading,但發現進商品頁面後再回到主頁又會重複跑 Loading,個人覺得沒有必要做多餘的 Loading 畫面(因為商品早在第一次進網站時就載入完了)
      ，因此刪除 isPending 改用 products.length 做動態渲染來增加 UX(使用者體驗)*/}
      {products.length === 0 && !error ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Col className='category' as='section' lg={2}>
            <div
              ref={divRef} // 這裡 divRef 其實等同 (el) => (divRef.current = el) (react 提供的的簡寫語法)
              onClick={(e) => {
                // 再點擊事件中同時執行多個函式
                changeValue(e);
                active(e);
              }}
            >
              <Card>所有商品</Card>
              <Card>手機類</Card>
              <Card>耳機類</Card>
              <Card>遊戲類</Card>
            </div>
          </Col>
          <Col as='section' lg={10}>
            <select className='form-select'>
              {/* 讓價格不要進入選單選項內 */}
              <option value='' hidden>
                價格
              </option>
              <option value='價格: 低到高'>價格: 低到高</option>
              <option value='價格: 高到低'>價格: 高到低</option>
            </select>
            <h1 className='text-center mt-2'>{value}</h1>
            <Row>
              {/* 從小裝置到大裝置 Col 這塊div的個數 >> 12/12=1  6/12=2  4/12=3 */}
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
