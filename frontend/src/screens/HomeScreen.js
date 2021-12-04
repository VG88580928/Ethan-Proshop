import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // 優化過去 connect 的寫法
import { Col, Row, Card } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import { requestProducts } from '../redux/actions/productActions';
import { productReviewCreateReset } from '../redux/slices/productSlice';

const HomeScreen = ({ history, match, location }) => {
  const [value, setValue] = useState('所有商品');

  const path = location.pathname; // 取得 url 的 pathname 部分

  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const sortBy = location.search ? location.search.split('=')[1] : '';

  const divRef = useRef();

  const dispatch = useDispatch();

  const { products, page, pages, error } = useSelector(
    (state) => state.requestProducts
  );

  useEffect(() => {
    dispatch(requestProducts(keyword, pageNumber, sortBy));
    dispatch(productReviewCreateReset()); // 這邊要記得 reset，不然當你重複評論過一樣商品顯示你已評論過該商品後，再去看另一種商品時該訊息還會存在，因為剛剛的 error state 還留在那。
  }, [dispatch, keyword, pageNumber, sortBy]);

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

  const filteredProductsByCategory = (e) => {
    const category = e.target.textContent;
    history.push(`/search/${category}`);
  };

  return (
    <Row className='pt-5'>
      {/* 原本用 isPending 的 Boolean 值做 Loading,但發現進商品頁面後再回到主頁又會重複跑 Loading,個人覺得沒有必要做多餘的 Loading 畫面(因為商品早在第一次進網站時就載入完了)
      ，因此刪除 isPending 改用 products.length === 0 && !error 做動態渲染來增加 UX(使用者體驗) => 但後來做了換頁功能和搜尋功能，這樣換頁搜尋時就不會跑 loader 了，不確定要不要改回來 */}
      {products.length === 0 && !error ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          {/* 如果我們正在搜尋或 sort 商品頁面(url 有 keyword or query 時)，就不顯示幻燈片 */}
          {!keyword && !sortBy && <ProductCarousel />}
          <Col className='category' as='section' lg={2}>
            <div
              ref={divRef} // 這裡 divRef 其實等同 (el) => (divRef.current = el) (react 提供的的簡寫語法)
              onClick={(e) => {
                // 再點擊事件中同時執行多個函式
                changeValue(e);
                active(e);
              }}
            >
              <Card onClick={() => history.push('/')}>所有商品</Card>
              <Card onClick={filteredProductsByCategory}>手機類</Card>
              <Card onClick={filteredProductsByCategory}>耳機類</Card>
              <Card onClick={filteredProductsByCategory}>遊戲類</Card>
            </div>
          </Col>
          <Col as='section' lg={10}>
            <select
              className='form-select'
              style={{ marginTop: '10px' }}
              onChange={(e) => {
                history.push(`${path}?sort_by=${e.target.value}`);
              }}
            >
              {/* 讓價格不要進入選單選項內 */}
              <option value='價格' hidden>
                價格
              </option>
              <option value='price-ascending'>價格: 低到高</option>
              <option value='price-descending'>價格: 高到低</option>
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
            <Paginate pages={pages} page={page} sortBy={sortBy} />
          </Col>
        </>
      )}
    </Row>
  );
};

export default HomeScreen;
