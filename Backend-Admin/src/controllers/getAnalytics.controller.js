import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.util";


const getAnalyticsController = asyncHandler(async(req,res)=>{
    const response = await getAnalytics();
    return res.status(200).json(
        new ApiResponse(200,response.data,"Analytics fetched")
        
    )
})
