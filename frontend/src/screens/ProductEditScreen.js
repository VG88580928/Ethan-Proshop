import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { requestProductDetails } from '../redux/actions/productActions';
import { updateProduct } from '../redux/slices/apiCalls';
import { productUpdateReset } from '../redux/slices/productSlice';

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id; // 取得 url 上的 id

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const { pending, error, product } = useSelector(
    (state) => state.requestProductDetails
  );

  const { userInfo } = useSelector((state) => state.userLogin);

  const {
    pending: pendingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = useSelector((state) => state.productUpdate);

  useEffect(() => {
    // 這頁面可以不用擋沒登入的人沒關西，因為沒 token 也拿不到用戶資訊，頁面也會報錯

    if (successUpdate) {
      dispatch(productUpdateReset()); // 記得 reset，不然更新完商品後就進不來這頁面啦
      history.push('/admin/productlist');
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(requestProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, productId, history, successUpdate]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]; // e.target.files 回傳 array，而我們目前只改一張圖，所以選取 array[0] 取得 File object
    const formData = new FormData(); // formData => iterable object，可被 for...of 操作的物件
    formData.append('image', file); // 加入表單要提交的 key/value 資訊到 formData 內(Array.from(formData) 生成 array 後會像這樣 => [['image',File object],[],[]...])
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/upload', formData, config); // 這裡 data 回傳 cloud path(url)

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name: name.trim(),
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  return (
    <div className='pt-2'>
      <FormContainer>
        <NavLink
          to='/admin/productlist'
          className='btn btn-outline-secondary my-3'
        >
          返回
        </NavLink>
        <h1 className='text-center'>編輯商品</h1>
        {pendingUpdate && <Loader loaderType2 />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {pending ? (
          <Loader loaderType2 />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className='mb-3' controlId='name'>
              <Form.Label>名稱</Form.Label>
              <Form.Control
                type='name'
                placeholder='Product name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='price'>
              <Form.Label>價格</Form.Label>
              <Form.Control
                type='number'
                placeholder='Price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='image' className='mb-3'>
              <Form.Label>商品圖片</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type='file'
                accept='image/jpg, image/jpeg, image/png' // 選擇檔案時限制檔案類型，增加一點點 UX
                onChange={uploadFileHandler}
              />
              {uploading && <Loader loaderType2 />}
            </Form.Group>
            {/* <Form.Group className='mb-3' controlId='image'>
              <Form.Label>圖片</Form.Label>
              <Form.Control
                type='file'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
              <Form.File id='image-file' label='選擇檔案' custom></Form.File>
            </Form.Group> */}

            <Form.Group className='mb-3' controlId='brand'>
              <Form.Label>品牌</Form.Label>
              <Form.Control
                type='text'
                placeholder='Brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='countInStock'>
              <Form.Label>庫存</Form.Label>
              <Form.Control
                type='number'
                placeholder='CountInStock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='category'>
              <Form.Label>總類</Form.Label>
              <Form.Control
                type='text'
                placeholder='Category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='description'>
              <Form.Label>敘述</Form.Label>
              <Form.Control
                type='text'
                placeholder='Description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <div className='d-flex justify-content-center'>
              <Button
                className='btn-lg my-3 fs-6'
                variant='primary'
                type='submit'
              >
                更新
              </Button>
            </div>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default ProductEditScreen;
