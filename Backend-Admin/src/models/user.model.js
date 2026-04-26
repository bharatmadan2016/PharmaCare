import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true, 
        lowercase:true,
        trim:true,
        unique:true,
        index:true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
    },phone:{
        type:String,
        
    },password:{
        type:String,
        required:true, 
        select:false
    },
    latitude:Number,
    longitude:Number,
    userName:{
        type:String,
        unique:true,
        sparse:true

    },
    role:{
        type:String,
        enum:["User","Admin"],
        default:"User"
    },
    refreshToken:{
        type:String,
        select:false

    }
  
},{
    timestamps:true
});
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return 

    this.password = await bcrypt.hash(this.password,10)
   
    
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        role:this.role

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || process.env.ACCESS_TOKEN_ENTRY || "1d",
    }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,

    },
        process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d"

    })
}


export const User= mongoose.model("User",userSchema)
