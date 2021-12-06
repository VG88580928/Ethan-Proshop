import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // 因為這個 component 沒有被 Route 包住，所以要自己去拿 history。 p.s. 拿 location => useLocation()，拿 match => useMatch()
import { Form, Button } from 'react-bootstrap';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');

  const history = useHistory();

  const datalistRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword.trim()}`); // 這邊 push 後會帶著這個 keyword 請求後端向 DB 做搜尋
    } else {
      history.push('/'); // 沒打東西就回首頁
    }
  };

  const inputHandler = (e) => {
    setKeyword(e.target.value);
  };

  const AutoCompleteSearchSuggestions = async () => {
    let emptyArray = [];
    const { data: allProducts } = await axios.get('/api/products/all'); // GET allProducts

    if (keyword.trim()) {
      emptyArray = allProducts.filter((product) => {
        return product.name
          .toLocaleLowerCase()
          .startsWith(keyword.toLocaleLowerCase().trim()); // 先用 filter() 把名字開頭符合 keyword 的商品丟到這個空 array
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
    datalistRef.current.innerHTML = listData; // 要注意 innerHTML 的安全性風險(XSS攻擊)，不過我的 listData 不是接 input value 可能還好?!
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        className='ms-3 me-2' // sm: min-width: 576px
        type='text'
        name='query'
        placeholder='搜尋商品...'
        list='suggestions' // 和 datalist 的 id 做綁定('suggestions')
        value={keyword}
        onChange={inputHandler}
        onKeyUp={AutoCompleteSearchSuggestions} // 這邊要使用 onKeyUp，這樣打完第一個字後(鍵盤按鍵被鬆開時)就會觸發 function，如果用 onChange，它會在 input 失去焦點後才觸發，但失去焦點的話 datalist 又會消失，等於說雖然第一個字打了，function 也觸發了，但卻看不到 datalist 的尷尬情形，會變成打下第二個字時才搜尋的到。
      />
      <datalist id='suggestions' ref={datalistRef}></datalist>
      <Button type='submit' variant='outline-success' className='d-flex p-2'>
        <i className='fas fa-search search-icon'></i>
      </Button>
    </Form>
  );
};

export default SearchBox;
