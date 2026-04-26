import mongoose, {Schema} from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        vendorId: {
            type: Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
            index: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            required: true,
            default: 0
        },
        expiry: {
            type: String,
            required: true
        },
        rxRequired: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)
