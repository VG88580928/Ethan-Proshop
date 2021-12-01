import React from 'react';
import { useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap'; // 因為 Pagination.Item .Prev .Next 都是 <li> 包著 <a>，所以 as={NavLink} 無法直接打到 <a> 上面，所以借用 LinkContainer 來完成。
import { Pagination } from 'react-bootstrap';

const Paginate = ({ pages, page, sortBy }) => {
  const location = useLocation();
  const path = location.pathname; // 取得 url 的 pathname 部分
  const query = location.search; // 取得 url 從 ? 開始的字串 ex: ?sort_by=price-ascending

  // 把在 /page/ 之前的 url 部分給取下來，方便此 component 未來可以重複利用。(例如用在 /admin/orderlist/page/4, /admin/userlist/page/8...等等)
  // 如果 url 直接是 /page/...，此時 baseURL 會回傳 '' 空字串，如果 url 是 / (首頁)，baseURL = '/'，避免此時 to 變成 '//page/...'，讓 baseURL 為空字串
  const baseURL =
    path.split('/page/')[0] === '/' ? '' : path.split('/page/')[0];

  return (
    pages > 1 && (
      <Pagination className='d-flex justify-content-center'>
        <LinkContainer
          to={
            query
              ? `${baseURL}/page/${page > 1 ? page - 1 : 1}?sort_by=${sortBy}`
              : `${baseURL}/page/${page > 1 ? page - 1 : 1}`
          }
        >
          <Pagination.Prev disabled={page === 1} />
        </LinkContainer>
        {[...Array(pages).keys()].map((i) => (
          <LinkContainer
            key={i}
            to={
              query
                ? `${baseURL}/page/${i + 1}?sort_by=${sortBy}`
                : `${baseURL}/page/${i + 1}`
            }
          >
            <Pagination.Item active={i + 1 === page}>{i + 1}</Pagination.Item>
          </LinkContainer>
        ))}
        <LinkContainer
          to={
            query
              ? `${baseURL}/page/${page + 1}?sort_by=${sortBy}`
              : `${baseURL}/page/${page + 1}`
          }
        >
          <Pagination.Next disabled={page === pages} />
        </LinkContainer>
      </Pagination>
    )
  );
};

export default Paginate;
