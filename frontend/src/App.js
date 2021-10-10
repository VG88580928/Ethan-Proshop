import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Footer from './components/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/' component={HomeScreen} exact />
          {/* 由於Route path='/' 表示/後面亂打默認都會到HomeScreen 所以用exact避免這個默認行為 */}
          <Route path='/product/:id' component={ProductScreen} />
        </Container>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
