import { Router } from 'express';
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} from '../controllers/product.controller.js';
import { verifyVendor } from '../controllers/verifyVendor.controller.js';
import { verifyInternalRequest } from '../middleware/vendor.middleware.js';
import { getAdminAnalytics } from '../controllers/getAnalytics.controller.js';

import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/").get(verifyJWT, getAllProducts).post(verifyJWT, createProduct);
router.route("/:id").get(getProductById).patch(verifyJWT, updateProduct).delete(verifyJWT, deleteProduct);
router.get("/admin/medicines",verifyInternalRequest);
router.get("/admin/analytics",verifyInternalRequest,getAdminAnalytics)

export default router;
