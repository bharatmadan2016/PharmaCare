import mongoose, {Schema} from "mongoose";

const orderSchema = new Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        customerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        pharmacyId: {
            type: Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
            index: true
        },
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        },
        paymentStatus: {
            type: String,
            enum: ["Paid", "Unpaid", "Refunded"],
            default: "Unpaid"
        },
        paymentMethod: {
            type: String,
            enum: ["Cash on Delivery", "Online"],
            default: "Cash on Delivery"
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model("Order", orderSchema)
