import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { requestProductDetails } from '../redux/actions/productActions';
import { addToCart } from '../redux/slices/apiCalls';

const ProductScreen = ({ history, match }) => {
  // 接收props集合(match、location、history、staticContext等),由Route提供的屬性
  const [quantity, setQuantity] = useState(0);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.requestProductDetails);
  const { product, error } = productDetails;

  useEffect(() => {
    dispatch(requestProductDetails(match.params.id));
  }, [dispatch, match]);

  const inputNumberHandler = (e) => {
    const inputNumber = parseInt(e.target.value); // 字串轉成數字，移除小數點，非數字回傳 NaN (需要有小數點的話用 parseFloat())
    if (Number.isNaN(inputNumber) || inputNumber < 0) {
      setQuantity(''); // 如果輸入的不是數字 or 輸入負值讓 input value 保持 0
    } else if (inputNumber > product.countInStock) {
      setQuantity(product.countInStock); // 輸入數字最大值為商品總數量
    } else {
      setQuantity(inputNumber);
    }
  };

  const minusButtonHandler = () => {
    if (quantity > 0 && quantity <= product.countInStock) {
      setQuantity((prev) => setQuantity(prev - 1));
    }
  };

  const plusButtonHandler = () => {
    if (quantity < product.countInStock) {
      setQuantity((prev) => setQuantity(prev + 1));
    }
  };

  // history.push(B) A > B 頁面後，上一頁會回到 A,history.replace(B) A > B 頁面後，上一頁回到 A 的上一頁
  // const addToCartHandler = () => {
  //   quantity > 0 && history.push(`/cart/${match.params.id}?qty=${quantity}`);
  // };

  const addToCartHandler = async () => {
    await dispatch(addToCart(product._id, quantity));
    history.push('/cart');
  };

  return (
    <div className='product-screen pt-5'>
      {/* 這邊一定要加exact，否則返回鍵會一直處在active的狀態 */}
      <NavLink className='btn btn-outline-secondary my-3' to='/' exact>
        返回
      </NavLink>
      {/* 如果沒有加 && !error，當有 error 出現的情況，因為第一條件句還是符合會回傳 Loader 而導致錯誤訊息出不來  P.S. !==(優先性10) > &&(優先性6) */}
      {product._id !== match.params.id && !error ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          <Col className='product-screen-section' md={6}>
            {/* fluid = max-width:100% height:auto 讓圖片能鎖在Col這個container內 */}
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col className='product-screen-section' md={3}>
            {/* variant='flush' 移除外邊框 */}
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={` ${product.numReviews} 人評價`}
                />
              </ListGroup.Item>
              <ListGroup.Item> NT$ {product.price}</ListGroup.Item>
              <ListGroup.Item>
                <div>【商品敘述】:</div> {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col className='product-screen-section' md={3}>
            <Card>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>售價:</Col>
                    <Col>
                      <strong>NT${product.price}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>狀態</Col>
                    <Col>{product.countInStock ? '供貨中' : '已售完'}</Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>數量:</Col>
                      <Col>還剩{product.countInStock}件</Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <InputGroup>
                    <Button
                      variant='outline-secondary'
                      onClick={minusButtonHandler}
                    >
                      <i className='fas fa-minus'></i>
                    </Button>
                    <FormControl
                      aria-label='Example text with two button addons'
                      value={
                        quantity <= product.countInStock
                          ? quantity
                          : product.countInStock
                      }
                      onChange={inputNumberHandler}
                    />
                    <Button
                      variant='outline-secondary'
                      onClick={plusButtonHandler}
                    >
                      <i className='fas fa-plus'></i>
                    </Button>
                  </InputGroup>
                </ListGroup.Item>
                <ListGroup.Item>
                  {/* 售完商品無法加入購物車 */}
                  <Button
                    disabled={product.countInStock === 0 || !quantity}
                    className='w-100 fs-6'
                    onClick={addToCartHandler}
                  >
                    加入購物車
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ProductScreen;
