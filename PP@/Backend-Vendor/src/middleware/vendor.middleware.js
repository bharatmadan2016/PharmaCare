import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const checkVendorVerification = asyncHandler(async(req,res,next)=>{
    if (req.user.status !== "approved"){
        throw new ApiError(403,"Vendor not verified ")
    }
    next();
})
 const verifyInternalRequest = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({ message: "Unauthorized access" });
    }

    next();
};
export {checkVendorVerification,verifyInternalRequest}