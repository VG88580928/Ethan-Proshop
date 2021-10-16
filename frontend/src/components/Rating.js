import React from 'react';
import PropTypes from 'prop-types';

const Rating = ({ value, text }) => {
  return (
    <div className='rating'>
      {/* 製作五顆星星 */}
      {[1, 2, 3, 4, 5].map((index) => (
        <i
          key={index}
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
// 星星顏色也可以在這個component上設置defaultProps來帶入color

Rating.propTypes = {
  text: PropTypes.string.isRequired,
};

// propTypes算React內置的型別檢查功能，可定義類型，值是否需要等等，寫錯型別會幫我們跳警告再console上。(屬性p是小寫)
// propTypes僅在開發模式下檢查，不影響效能。

export default Rating;
