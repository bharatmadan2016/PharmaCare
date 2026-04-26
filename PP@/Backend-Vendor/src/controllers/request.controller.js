// import { User } from "../../../../Backend-Admin/src/models/user.model";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Vendor} from "../models/vendor.model.js";


const giveRequestOfVerification = asyncHandler(async (req, res) => {
    const { vendorId } = req.params;
    
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
        throw new ApiError(404, "Vendor not found");
    }
    
    if (vendor.verificationStatus === "pending") {
        throw new ApiError(400, "Verification request already pending");
    }
    
    vendor.verificationStatus = "pending";
    vendor.isApproved = false;
    await vendor.save();
    
    return res.status(200).json(
        new ApiResponse(200, vendor, "Verification request sent to admin")
    );
});

export {giveRequestOfVerification}