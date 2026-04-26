import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const vendorSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        pharmacyName: {
            type: String,
            required: true,
            trim: true,
        },
        ownerName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String
        },
        status:{
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"

        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
                default: [0, 0]
            }
        }
    },
    {
        timestamps: true
    }
)

vendorSchema.index({ location: "2dsphere" })

vendorSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

vendorSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

vendorSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            pharmacyName: this.pharmacyName,
            ownerName: this.ownerName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

vendorSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Vendor = mongoose.model("Vendor", vendorSchema)
