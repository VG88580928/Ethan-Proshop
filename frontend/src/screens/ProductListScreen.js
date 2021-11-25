import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Table, Button, Modal, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { requestProducts } from '../redux/actions/productActions';
import {
  productCreateReset,
  productDeleteReset,
} from '../redux/slices/productSlice';
import { deleteProduct, createProduct } from '../redux/slices/apiCalls';

const ProductListScreen = ({ history, match }) => {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('所有商品');
  const [filterdProducts, setFilterdProducts] = useState([]);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userLogin);

  const { products, error, isPending } = useSelector(
    (state) => state.requestProducts
  );

  const {
    pending: pendingDelete,
    error: errorDelete,
    success: successDelete,
  } = useSelector((state) => state.productDelete);

  const {
    pending: pendingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = useSelector((state) => state.productCreate);

  const filterdProductsHandler = () => {
    switch (status) {
      case '個人商品':
        setFilterdProducts(
          products.filter((product) => product.user === userInfo._id)
        );
        break;
      default:
        setFilterdProducts(products);
        break;
    }
  };

  useEffect(() => {
    dispatch(productCreateReset());
    dispatch(productDeleteReset()); // 這邊也要記得 reset,不然連續刪兩個 product,第二次刪畫面不會更新
    dispatch(requestProducts());

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login');
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    }
  }, [
    dispatch,
    userInfo,
    history,
    successDelete,
    successCreate,
    createdProduct,
  ]);

  useEffect(() => {
    filterdProductsHandler();
  }, [products, status]);

  const showModalHandler = () => setShowModal(true);
  const closeModalHandler = () => setShowModal(false);

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const deleteHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  const statusHandler = (e) => {
    setStatus(e.target.value);
  };

  return (
    <div className='pt-5'>
      <Row className='align-items-center'>
        <Col>
          <h1>商品列表</h1>
          <select className='form-select mb-2' onChange={statusHandler}>
            <option value='所有商品'>所有商品</option>
            <option value='個人商品'>個人商品</option>
          </select>
        </Col>
        <Col className='text-end'>
          <Button className='my-3 p-2 fs-5' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> 建立商品
          </Button>
        </Col>
      </Row>
      {pendingDelete && <Loader loaderType2 />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {pendingCreate && <Loader loaderType2 />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {isPending ? (
        <Loader loaderType2 />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>名稱</th>
              <th>價格</th>
              <th>種類</th>
              <th>品牌</th>
            </tr>
          </thead>
          <tbody>
            {filterdProducts.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <Button
                    className='me-2'
                    variant='dark'
                    as={NavLink}
                    to={`/admin/product/${product._id}/edit`}
                  >
                    <i className='fas fa-edit'></i>
                  </Button>
                  <Button variant='danger' onClick={showModalHandler}>
                    <i className='fas fa-trash'></i>
                  </Button>

                  <Modal show={showModal} onHide={closeModalHandler}>
                    <Modal.Body>確定要刪除此商品嗎?</Modal.Body>
                    <Modal.Footer>
                      <Button
                        className='fs-5'
                        variant='secondary'
                        onClick={closeModalHandler}
                      >
                        取消
                      </Button>
                      <Button
                        className='fs-5'
                        variant='primary'
                        onClick={() => {
                          deleteHandler(product._id);
                          closeModalHandler();
                        }}
                      >
                        刪除
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProductListScreen;