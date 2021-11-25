import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'; // 因為這個 component 沒有被 Route 包住，所以要自己去拿 history。 p.s. 拿 location => useLocation()，拿 match => useMatch()
import { Form, Button } from 'react-bootstrap';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');

  const history = useHistory();

  const datalistRef = useRef();

  const { products } = useSelector((state) => state.requestProducts);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword.trim()}`); // 這邊 push 後會請求後端向 DB 做搜尋(如果今天搜尋欄只在首頁出現，當然也可以直接 filter 現有 state 的 products，但是要是今天我們網站是蝦皮，產品有上百萬種，那可憐的 browser 就要 filter 上百萬種的產品...，所以我認為這會是一個 bad practice，還有另一個不這麼做的理由是我的商品搜尋欄是顯示在所有頁面的，因此我們一定得向後端請求)
    } else {
      history.push('/'); // 沒打東西就回首頁
    }
  };

  const inputHandler = (e) => {
    setKeyword(e.target.value);
  };

  const AutoCompleteSearchSuggestions = () => {
    let emptyArray = [];
    if (keyword.trim()) {
      emptyArray = products.filter((product) => {
        return product.name.toLocaleLowerCase().startsWith(keyword.trim()); // 先用 filter() 把名字開頭符合 keyword 的商品丟到這個空 array
      });
      // 之後再把這些商品的名字用 map 取出來，頭尾加上 html 的 <option></option> 後生成新 array
      emptyArray = emptyArray.map((filteredProduct) => {
        return '<option>' + filteredProduct.name + '</option>';
      });
    }
    showSuggestions(emptyArray); // 最後把這妥 array，丟進去用 join('') 轉成一串 string，再 append 到 datalist 裡
  };

  const showSuggestions = (list) => {
    let listData;
    if (list.length) {
      listData = list.join('');
    }
    datalistRef.current.innerHTML = listData;
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        className='ms-3 me-2' // sm: min-width: 576px
        type='text'
        name='query'
        placeholder='搜尋商品...'
        list='suggestions'
        onChange={inputHandler}
        onKeyUp={AutoCompleteSearchSuggestions}
      />
      <datalist id='suggestions' ref={datalistRef}></datalist>
      <Button type='submit' variant='outline-success' className='d-flex p-2'>
        <i className='fas fa-search search-icon'></i>
      </Button>
    </Form>
  );
};

export default SearchBox;
