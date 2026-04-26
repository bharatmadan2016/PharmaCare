import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Vendor } from "../models/vendor.model.js";

const getAdminAnalytics =asyncHandler(async(req,res)=>{
    const totalVendors = await Vendor.countDocuments();
    const approvedVendors = await Vendor.countDocuments({ status: "approved" });

    const pendingVendors = await Vendor.countDocuments({ status: "pending" });

    const totalMedicines = await Medicine.countDocuments();

    // const lowStockMedicines = await Medicine.find({ stock: { $lt: 10 } });

    return res.status(200).json(
        new ApiResponse(200,{
        totalVendors,
        approvedVendors,
        pendingVendors,
        totalMedicines
        },"Analytics Fetch Successfully")

    )


})
export {getAdminAnalytics}