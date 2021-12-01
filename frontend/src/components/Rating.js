import React from 'react';
// import PropTypes from 'prop-types';

const Rating = ({ value, text, color, margin }) => {
  return (
    <div className='rating'>
      {/* 製作五顆星星 */}
      {[1, 2, 3, 4, 5].map((index) => (
        <i
          key={index}
          style={{ color, margin }}
          className={
            value >= index
              ? 'fas fa-star'
              : value >= index - 0.5
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        />
      ))}
      <span>{text ? text : ''}</span>
    </div>
  );
};
// https://fontawesome.com/v5.15/icons?d=gallery&p=2&q=star 三種星星來源

// 設置 defaultProps 來帶入默認 color & margin
Rating.defaultProps = {
  color: '#ee4d2d',
  margin: '0.1rem',
};

// propTypes 是 React 內置的型別檢查功能，可定義類型，值是否需要等等，寫錯型別會幫我們跳警告再 console 上。(屬性 p 是小寫)
// propTypes 僅在開發模式下檢查，不影響效能。
// Rating.propTypes = {
//   text: PropTypes.string.isRequired, // 因為後來同頁面做了評論功能所以取消此限制，不然評論區沒有 '?人評論'的字串 console 會噴警告
// };

export default Rating;
