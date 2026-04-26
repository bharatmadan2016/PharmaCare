import { Router } from 'express';
import { 
    createOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus 
} from '../controllers/order.controller.js';

import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/").get(verifyJWT, getAllOrders).post(verifyJWT, createOrder);
router.route("/:id").get(verifyJWT, getOrderById).patch(verifyJWT, updateOrderStatus);

export default router;
