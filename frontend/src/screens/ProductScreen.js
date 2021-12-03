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
  Form,
} from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { requestProductDetails } from '../redux/actions/productActions';
import { productReviewCreateReset } from '../redux/slices/productSlice';
import { addToCart, creatProductReview } from '../redux/slices/apiCalls';

const ProductScreen = ({ history, match }) => {
  // 接收props集合(match、location、history、staticContext等),由Route提供的屬性
  const [quantity, setQuantity] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userLogin);

  const { product, error } = useSelector(
    (state) => state.requestProductDetails
  );

  const { success: successReviewCreate, error: errorReviewCreate } =
    useSelector((state) => state.productReviewCreate);

  useEffect(() => {
    if (successReviewCreate) {
      alert('評價成功!');
      setRating(0);
      setComment('');
      dispatch(productReviewCreateReset());
    }
    dispatch(requestProductDetails(match.params.id));
  }, [dispatch, match, successReviewCreate]);

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

  // 這裡如果不使用 async 寫法，超過庫存警告會在跳轉到購物車頁面後才出現，我希望他在跳轉前就出現因此使用 async 寫法
  const addToCartHandler = async () => {
    await dispatch(addToCart(product._id, quantity));
    history.push('/cart'); // 小知識: 'cart' 和 '/cart' 兩種寫法差別在前面會直接疊上去，例如本來在 /product => /product/cart(這是因為 /product/:id 後面有一個 :id 會變成 cart)，後者是本來在 /product => /cart
  };

  const submitHandler = (e) => {
    e.preventDefault(); // 防止頁面 reload
    dispatch(
      creatProductReview(match.params.id, {
        rating,
        comment,
      })
    );
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
        <>
          <Row>
            <Col className='product-screen-section' md={6}>
              {/* fluid = max-width:100% height:auto 讓圖片能鎖在 Col 這個 container 內 */}
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
                <ListGroup.Item> ${product.price}</ListGroup.Item>
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
                        <strong>${product.price}</strong>
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
          <Row>
            <Col md={12}>
              <h2 className='reviewsHeading'>商品評價</h2>
              {product.reviews.length === 0 && (
                <p className='noReviews'>尚無評價</p>
              )}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>寫下商品評價</h2>
                  {errorReviewCreate && (
                    <Message variant='danger'>{errorReviewCreate}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>評價</Form.Label>
                        <Form.Control
                          as='select'
                          className='rating-select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                          required
                        >
                          <option value=''>選擇</option>
                          <option value='1'>1 - 超級爛</option>
                          <option value='2'>2 - 不太喜歡</option>
                          <option value='3'>3 - 普通</option>
                          <option value='4'>4 - 還不錯</option>
                          <option value='5'>5 - 非常棒</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId='comment'>
                        <Form.Label>商品評論</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required
                        ></Form.Control>
                      </Form.Group>

                      <Button
                        className='btn-lg mt-3 fs-6'
                        variant='primary'
                        type='submit'
                      >
                        提交
                      </Button>
                    </Form>
                  ) : (
                    <Message center>
                      需先<NavLink to='/login'>登入</NavLink>才可以評論哦!
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
