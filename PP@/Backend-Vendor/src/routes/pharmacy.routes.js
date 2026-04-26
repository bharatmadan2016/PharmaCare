import { Router } from "express";
import { 
    getNearbyPharmacies, 
    getPharmacyMedicines, 
    comparePrices 
} from "../controllers/pharmacy.controller.js";

const router = Router();

router.route("/nearby").get(getNearbyPharmacies);
router.route("/medicines/:pharmacyId").get(getPharmacyMedicines);
router.route("/compare").get(comparePrices);

export default router;
