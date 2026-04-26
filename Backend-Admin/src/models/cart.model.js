import mongoose, { Schema } from "mongoose"

const cartSchema= new mongoose.Schema({
    cart_is:{
        type:String,
        required:true,
    },
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        required:true
    }
},{timestamps:true})
