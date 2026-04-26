import { Router } from 'express';
import { 
  loginVendor, 
  registerVendor,
  getAllVendors,
  approveVendor,
  updateVendorProfile
   
} from '../controllers/vendor.controller.js';
import { verifyInternalRequest } from '../middleware/vendor.middleware.js';

import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

router.route("/")
  .get(verifyInternalRequest, getAllVendors);
router.route("/register").post(registerVendor);
router.route("/login").post(loginVendor);
router.route("/profile").patch(verifyJWT, updateVendorProfile);
router.route("/:id/approve").patch(verifyInternalRequest, approveVendor);
// router.route("/request").post(giveRequestOfVerification);

export default router;
