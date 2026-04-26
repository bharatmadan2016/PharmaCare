import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";

const createOrder = asyncHandler(async (req, res) => {
    const { customerId, pharmacyId, items, totalAmount, paymentMethod } = req.body;

    if (!customerId || !pharmacyId || !items || !totalAmount) {
        throw new ApiError(400, "All fields are required");
    }

    const orderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const order = await Order.create({
        orderId,
        customerId,
        pharmacyId,
        items,
        totalAmount,
        paymentMethod: paymentMethod || "Cash on Delivery"
    });

    return res.status(201).json(
        new ApiResponse(201, order, "Order created successfully")
    );
});

const getAllOrders = asyncHandler(async (req, res) => {
    let filter = {};
    
    // If not internal (Backend-Admin), filter by logged-in vendor's ID
    if (!req.isInternal && req.user) {
        filter = { pharmacyId: req.user._id };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(
        new ApiResponse(200, orders, "Orders fetched successfully")
    );
});

const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order fetched successfully")
    );
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
        id,
        {
            $set: {
                status,
                paymentStatus
            }
        },
        { new: true }
    );

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order status updated successfully")
    );
});

export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus
}
