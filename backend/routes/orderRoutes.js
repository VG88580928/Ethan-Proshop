import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById); // 這種有接參數的 route 要放在 '/' route 底下，怕放在上面會接到不該接的 :id
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;
