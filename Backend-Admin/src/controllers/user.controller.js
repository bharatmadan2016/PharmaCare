import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import { ApiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user =await User.findById(userId);
        if(!user){
            throw new ApiError(400,"User not found")
        }
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false});
        return{accessToken,refreshToken}
        
    } catch (error) {
        console.log("Error:",error.message)
        throw error;
        
    }
}


const registerUser= asyncHandler(async(req,res)=>{
    const {name,email,password,latitude,longitude,role,userName}=req.body
    const normalizedName = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    if(
        [normalizedName,normalizedEmail,normalizedPassword].some((field)=>!field)
    ){
        throw new ApiError(400,"All compulsory fields are required")
    }

    const normalizedUserName = userName?.trim() || `${normalizedName.toLowerCase().replace(/\s+/g, "")}-${Date.now()}`;

    const existedUser=await User.findOne({ email: normalizedEmail })
    if(existedUser){
        throw new ApiError(409,"An account with this email already exists")
    }
    const user =await User.create({
        name: normalizedName,
        email: normalizedEmail,
        userName: normalizedUserName,
        latitude,
        longitude,
        role,
        password: normalizedPassword,


    })
    const createdUsername=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUsername){
        throw new ApiError(500,"Something went wrong")
    }
    return res.status(201).json(
        new ApiResponse(201, createdUsername, "User Registered")
    )

})
const loginUser=asyncHandler(async(req,res)=>{
    //get data 
    //password match hash
    //login name exist?
    
    const {password,email}=req.body
    const normalizedEmail = email?.trim().toLowerCase();

    if (!password?.trim() || !normalizedEmail ){
        throw new ApiError(400,"Email and password are required")
    }
    const user= await User.findOne({email: normalizedEmail}).select("+password")
    if(!user){
        throw new ApiError(400,"User not found")

    }
    const isPasswordValid=await user.isPasswordCorrect(password.trim())
    if(!isPasswordValid){
        throw new ApiError(400,"Password incorrect")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    const option= {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",

    }
    return res.status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    
    .json(new ApiResponse(200,
        {user:loggedInUser,accessToken},
        "User logged in"
    ))
    

    
})
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new :true
        }
    )
    const option={
        httpOnly:true,
        secure:process.env.NODE_ENV === "production"
    }
    return res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new ApiResponse(200,{},"User logged out"))
})
const getProfile = asyncHandler(async (req, res) => {
    return res.status(200).json({
        user: req.user
    })
})
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id).select("-password -refreshToken");

    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, deletedUser, "User deleted successfully")
    );
})


export {registerUser,loginUser,logoutUser,getProfile, deleteUser}
