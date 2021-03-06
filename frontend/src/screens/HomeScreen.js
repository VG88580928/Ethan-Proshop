import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // 優化過去 connect 的寫法
import { Col, Row, Card } from 'react-bootstrap';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { requestProducts } from '../redux/actions/productActions';
import {
  productReviewCreateReset,
  productCategoryChange,
} from '../redux/slices/productSlice';

const HomeScreen = ({ history, match, location }) => {
  const path = location.pathname; // 取得 url 的 pathname 部分 (不包括 query 部分)

  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;

  const sortBy = location.search ? location.search.split('=')[1] : ''; // location.search 取得 url query 部分(包括 ?)

  const dispatch = useDispatch();

  const { category } = useSelector((state) => state.productCategory);

  const { isPending, products, page, pages, error } = useSelector(
    (state) => state.requestProducts
  );

  useEffect(() => {
    dispatch(requestProducts(keyword, pageNumber, sortBy));
    dispatch(productReviewCreateReset()); // 這邊要記得 reset，不然當你重複評論過一樣商品顯示你已評論過該商品後，再去看另一種商品時該訊息還會存在，因為剛剛的 error state 還留在那。

    if (path === '/') {
      dispatch(productCategoryChange('全部商品'));
    }
  }, [dispatch, keyword, pageNumber, sortBy, path]);

  const changeValue = (e) => {
    dispatch(productCategoryChange(e.target.textContent));
  };

  const filteredProductsByCategory = (e) => {
    const category = e.target.textContent;
    history.push(`/search/${category}`);
    changeValue(e);
  };

  const getFilterUrl = (filter) => {
    // 這樣寫未來比較方便加更多功能
    const sortOrder = filter.order;

    return `${path}?sort_by=${sortOrder}`;
  };

  return (
    <Row className='home-screen pt-5'>
      <Meta title='倫倫の商城 | 首頁' />
      {/* 原本用 isPending 的 Boolean 值做 Loading,但發現進商品頁面後再回到主頁又會重複跑 Loading,個人覺得沒有必要做多餘的 Loading 畫面(因為商品早在第一次進網站時就載入完了)
      ，因此刪除 isPending 改用 products.length === 0 && !error 做動態渲染來增加 UX(使用者體驗) */}
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
              onClick={(e) => {
                /*這邊利用了 Event Delegation 的技巧，所以只需要在 div 上註冊一次點擊事件。
                  多檢查了 e.target.className.includes('card') 是因為發現原本點到商品種類之間的縫隙
                  會直接把所有 value 印到畫面上(變這樣 =>'全部商品滑鼠類耳機類遊戲類') */
                if (e.target.className.includes('card'))
                  filteredProductsByCategory(e);
              }}
            >
              <Card className={category === '全部商品' && 'active'}>
                全部商品
              </Card>
              <Card className={category === '滑鼠類' && 'active'}>滑鼠類</Card>
              <Card className={category === '耳機類' && 'active'}>耳機類</Card>
              <Card className={category === '遊戲類' && 'active'}>遊戲類</Card>
            </div>
          </Col>
          <Col as='section' lg={10}>
            <select
              className='form-select'
              style={{ marginTop: '10px' }}
              onChange={(e) => {
                history.push(getFilterUrl({ order: e.target.value }));
              }}
            >
              {/* 讓價格不要進入選單選項內 */}
              <option value='價格' hidden>
                價格
              </option>
              <option value='price-ascending'>價格: 低到高</option>
              <option value='price-descending'>價格: 高到低</option>
            </select>
            {isPending ? (
              <Loader loaderType2></Loader>
            ) : (
              <>
                {keyword === '全部商品' ||
                keyword === '滑鼠類' ||
                keyword === '耳機類' ||
                keyword === '遊戲類' ||
                path === '/' ||
                path.substring(0, 6) === '/page/' ? (
                  <h1 className='text-center mt-2'>{category}</h1>
                ) : (
                  <h1 className='text-center mt-2'>查詢結果</h1>
                )}
                {/* <h1 className='text-center mt-2'>{category}</h1> */}
                <Row>
                  {/* 從小裝置到大裝置 Col 這塊div的個數 >> 12/12=1  6/12=2  4/12=3 */}
                  {products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4}>
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>
                <Paginate pages={pages} page={page} sortBy={sortBy} />
              </>
            )}
          </Col>
        </>
      )}
    </Row>
  );
};

export default HomeScreen;
