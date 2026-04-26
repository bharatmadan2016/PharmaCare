import { Router } from "express";
import {
  approveVendorController,
  fetchDashboardOverview,
  fetchOrdersController,
  fetchPaymentsController,
  fetchReportsController,
  fetchUsersController,
  fetchVendors,
} from "../controllers/admin.controller.js";
import { deleteUser } from "../controllers/user.controller.js";
import { requireRole, verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT, requireRole("Admin"));

router.get("/dashboard", fetchDashboardOverview);
router.get("/users", fetchUsersController);
router.delete("/users/:id", deleteUser);
router.get("/vendors", fetchVendors);
router.patch("/vendors/:id/approve", approveVendorController);
router.get("/orders", fetchOrdersController);
router.get("/payments", fetchPaymentsController);
router.get("/reports", fetchReportsController);

export default router;
