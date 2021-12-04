import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  FormControl,
  InputGroup,
  Image,
  Button,
  Card,
  ListGroupItem,
} from 'react-bootstrap';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../redux/slices/apiCalls';
import { removeProduct } from '../redux/slices/cartSlice';

const CartScreen = ({ history }) => {
  // const [quantity, setQuantity] = useState(0);
  // const productId = match.params.id;
  // const qty = location.search ? Number(location.search.split('=')[1]) : 1; // location.search: 取得 url ? 後面的 qty=num 字串,再用 split 技巧取得我們要的 num 字串

  // 如何對 array 裡的每個 element 使用 refs 來取得各個 element node?((且 array 長度不固定)) 參考以下回答一樓
  // https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
  const minusButtonRef = useRef([]); // you can access the elements with minusButtonRef.current[n] 起始值 {current: []}
  const plusButtonRef = useRef([]); // you can access the elements with plusButtonRef.current[n]

  const dispatch = useDispatch();

  const cartProducts = useSelector((state) => state.cart.products);
  const qty = useSelector((state) => state.cart.quantity);
  const total = cartProducts
    .reduce((acc, p) => acc + p.quantity * p.price, 0)
    .toFixed(2);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  // useEffect(() => {
  //   // 只有在頁面有拿到 ID 時才執行 addToCart(就是按加入購物車時)，從右上角進入購物車時不執行
  //   if (productId) {
  //     dispatch(addToCart(productId, qty));
  //   }
  // }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id, product) => {
    dispatch(
      removeProduct({
        id,
        price: product.price,
        quantity: product.quantity,
      })
    );
  };

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping'); // 如果用戶已經登入，可以選擇直接導向 shipping(ShippingScreen)
  };

  return (
    <Row className='cart-screen pt-5'>
      <Meta title='倫倫の商城 | 購物車' />
      <Col md={8} className='left-part'>
        <h1>購物車</h1>
        {cartProducts.length === 0 ? (
          <Message>
            您的購物車目前沒有商品哦{' '}
            <NavLink to='/' style={{ marginLeft: '15px' }}>
              繼續逛逛
            </NavLink>
          </Message>
        ) : (
          <ListGroup>
            {cartProducts.map((product, i) => (
              <ListGroup.Item key={product._id}>
                <Row>
                  <Col md={2}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fluid
                      rounded
                    ></Image>
                  </Col>
                  <Col md={3}>
                    <NavLink to={`/product/${product._id}`}>
                      {product.name}
                    </NavLink>
                  </Col>
                  <Col md={2}>${product.price}</Col>
                  <Col md={4}>
                    <ListGroup.Item className='quantity-div'>
                      <InputGroup>
                        <Button
                          variant='outline-secondary'
                          ref={(el) => (minusButtonRef.current[i] = el)} // 參數 el 接收當前的 button node，把迴圈裡的每個 button 節點放進 minusButtonRef.current 這個 array 裡
                          // 因為我發現在購物車頁面，商品加減點太快會不小心超過商品總數或者變成負值，導致 input value 跑出條件式外而再也不能觸發加減商品功能
                          // 因此使用 async 寫法，確保非同步 action 取回後端資料 > 送到 reducer 生成新 state > store state 有確實更新後，才讓 button可以點擊
                          onClick={async () => {
                            if (
                              product.quantity > 1 &&
                              product.quantity <= product.countInStock
                            ) {
                              minusButtonRef.current[i].disabled = true;
                              await dispatch(addToCart(product._id, -1));
                              minusButtonRef.current[i].disabled = false;
                            }
                          }}
                        >
                          <i className='fas fa-minus'></i>
                        </Button>
                        <FormControl as='div' className='quantity'>
                          {product.quantity}
                        </FormControl>
                        <Button
                          variant='outline-secondary'
                          ref={(el) => (plusButtonRef.current[i] = el)}
                          onClick={async () => {
                            if (product.quantity < product.countInStock) {
                              plusButtonRef.current[i].disabled = true;
                              await dispatch(addToCart(product._id, 1));
                              plusButtonRef.current[i].disabled = false;
                            } else {
                              alert('數量不可超過庫存');
                            }
                          }}
                        >
                          <i className='fas fa-plus'></i>
                        </Button>
                      </InputGroup>
                    </ListGroup.Item>
                  </Col>
                  <Col md={1} className='flex-center-sm'>
                    <Button
                      type='button'
                      variant='success'
                      onClick={() =>
                        removeFromCartHandler(product._id, product)
                      }
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4} className='right-part'>
        <Card>
          <ListGroup variant='flush'>
            <ListGroupItem>
              <h2>共 {qty} 種商品</h2>
              <p className='fs-5'>總計 : {formatter.format(total)}</p>
            </ListGroupItem>
            <ListGroupItem>
              <Button
                className='w-100 fs-5'
                type='button'
                disabled={!cartProducts.length}
                onClick={checkoutHandler}
              >
                去買單
              </Button>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
