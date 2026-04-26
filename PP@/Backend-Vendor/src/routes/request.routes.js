import router from "../../../../Backend-Admin/src/routes/user.routes";
import { verifyVendor } from "../controllers/verifyVendor.controller";
import { checkVendorVerification } from "../middleware/vendor.middleware";

router.patch("/vendor/:id/verify",checkVendorVerification,verifyVendor)