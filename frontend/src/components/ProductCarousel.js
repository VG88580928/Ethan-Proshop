import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './Loader';
import Message from './Message';
import { requestTopRatedProducts } from '../redux/slices/apiCalls';

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const { error, products } = useSelector((state) => state.productTopRated);

  useEffect(() => {
    dispatch(requestTopRatedProducts());
  }, [dispatch]);

  return error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    // pause='hover' => hover 時暫停捲動
    <Carousel pause='hover' variant='dark'>
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <NavLink to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid></Image>
            <Carousel.Caption bsPrefix='carousel-caption'>
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </NavLink>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
