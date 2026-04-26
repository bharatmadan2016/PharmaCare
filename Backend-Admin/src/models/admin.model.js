import mongoose, { Schema } from "mongoose"

const adminSchema= new mongoose.Schema({
    user_id:{
        type:Schema.Types.ObjectId,

        ref:"User"
    }

},{
    timestamps:true
})

export const Admin= mongoose.model("Admin",adminSchema)