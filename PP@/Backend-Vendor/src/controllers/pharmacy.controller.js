import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Vendor } from "../models/vendor.model.js";
import { Product } from "../models/product.model.js";

const getNearbyPharmacies = asyncHandler(async (req, res) => {
    const { longitude, latitude, maxDistance = 50000 } = req.query; // Increase default to 50km

    if (!longitude || !latitude) {
        throw new ApiError(400, "Longitude and latitude are required");
    }

    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);

    const pharmacies = await Vendor.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                distanceField: "distance",
                maxDistance: parseInt(maxDistance),
                spherical: true,
                query: { status: "approved" }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "vendorId",
                as: "medicines"
            }
        },
        {
            $project: {
                password: 0,
                refreshToken: 0,
                "medicines.vendorId": 0
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, pharmacies, "Nearby pharmacies fetched successfully")
    );
});

const getPharmacyMedicines = asyncHandler(async (req, res) => {
    const { pharmacyId } = req.params;
    const products = await Product.find({ vendorId: pharmacyId });
    return res.status(200).json(
        new ApiResponse(200, products, "Pharmacy medicines fetched successfully")
    );
});

const comparePrices = asyncHandler(async (req, res) => {
    const { medicineName, longitude, latitude } = req.query;

    if (!medicineName) {
        throw new ApiError(400, "Medicine name is required for comparison");
    }

    let results;
    
    if (longitude && latitude) {
        const lng = parseFloat(longitude);
        const lat = parseFloat(latitude);

        // Find medicines and include distance from vendor
        results = await Product.aggregate([
            {
                $match: {
                    name: { $regex: medicineName, $options: "i" }
                }
            },
            {
                $lookup: {
                    from: "vendors",
                    localField: "vendorId",
                    foreignField: "_id",
                    as: "vendor"
                }
            },
            { $unwind: "$vendor" },
            {
                $addFields: {
                    "vendor.temp_location": "$vendor.location"
                }
            }
        ]);

        // MongoDB aggregate doesn't support $geoNear after $lookup easily for 2dsphere on joined docs
        // So we just use simple population and manual sorting or just return first results
        // Actually, let's just do a simple find and populate for now to keep it stable
        results = await Product.find({
            name: { $regex: medicineName, $options: "i" }
        })
        .populate("vendorId", "pharmacyName location status")
        .sort({ price: 1 });

        // Filter out unapproved vendors
        results = results.filter(item => item.vendorId?.status === "approved");
    } else {
        results = await Product.find({
            name: { $regex: medicineName, $options: "i" }
        })
        .populate("vendorId", "pharmacyName location status")
        .sort({ price: 1 });
        
        results = results.filter(item => item.vendorId?.status === "approved");
    }

    return res.status(200).json(
        new ApiResponse(200, results, "Price comparison fetched successfully")
    );
});

export {
    getNearbyPharmacies,
    getPharmacyMedicines,
    comparePrices
};
