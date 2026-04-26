import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.util.js"
import { User } from "../models/user.model.js"


const verifyJWT=asyncHandler(async(req,res,next)=>{
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace(/^Bearer\s+/i, "").trim()

    if(!token){
        throw new ApiError(401,"uNAUTHORIZED")

    }

    let decoded
    try {
        decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }

    const user =await User.findById(decoded._id).select("-password -refreshToken")
    if (!user) {
        throw new ApiError(401, "Invalid access token")
    }
    req.user = user
    next()

})

const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(new ApiError(403, "Forbidden"));
    }

    next();
}

export {verifyJWT, requireRole}
