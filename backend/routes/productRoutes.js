import express from 'express';
import {
  getProducts,
  getProductById,
} from '../controllers/productController.js';

const router = express.Router(); //creates a new router object

// Router-level middleware

router.route('/').get(getProducts); // 等同於 router.get('/', getProducts) (差異於最底下補充),還有 getProducts 其實等同於 (req,res) => {getProducts(req,res)},因為 dependency injection,req & res 被自動帶入
router.route('/:id').get(getProductById);

export default router;

// 補充: 兩種寫法差異
// If you have several methods on the same route, the advantage of using .route is to specify the route once.

// router
// .route('/')
// .get(getSomething)
// .post(addSomething)
// .delete(removeSomething)
// is equivalent to

// router
// .get('/', getSomething)
// .post('/', addSomething)
// .delete('/', removeSomething)
// or

// router.get('/', getSomething)
// router.post('/', addSomething)
// router.delete('/', removeSomething)
