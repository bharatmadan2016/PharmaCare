import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {
    let filter = {};
    if (!req.isInternal && req.user) {
        filter = { pharmacyId: req.user._id };
    }
    
    // For products, use vendorId filter
    let productFilter = {};
    if (!req.isInternal && req.user) {
        productFilter = { vendorId: req.user._id };
    }

    // 1. Basic Stats
    const totalOrders = await Order.countDocuments(filter);
    const pendingOrders = await Order.countDocuments({ ...filter, status: "Pending" });
    const deliveredOrders = await Order.countDocuments({ ...filter, status: "Delivered" });
    
    // 2. Revenue Aggregation
    const revenueAggregation = await Order.aggregate([
        { $match: { ...filter, paymentStatus: "Paid" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // 3. Low Stock Alerts (Stock < 20)
    const lowStockProducts = await Product.find({ ...productFilter, stock: { $lt: 20 } }).limit(5);
    const lowStockCount = await Product.countDocuments({ ...productFilter, stock: { $lt: 20 } });

    // 4. Recent Orders (Latest 5)
    const recentOrders = await Order.find(filter).sort({ createdAt: -1 }).limit(5);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue,
                lowStockCount,
                lowStockProducts,
                recentOrders
            },
            "Dashboard stats fetched successfully"
        )
    )
})

export {
    getDashboardStats
}
