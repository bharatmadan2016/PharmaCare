import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";

const createProduct = asyncHandler(async (req, res) => {
    const { name, category, stock, price, expiry, rxRequired, description } = req.body;

    if (!name || !category || stock === undefined || price === undefined || !expiry) {
        console.log("Validation Failed:", { name, category, stock, price, expiry });
        throw new ApiError(400, "Name, category, stock, price, and expiry are required");
    }

    const product = await Product.create({
        name,
        category,
        stock,
        price,
        expiry,
        rxRequired,
        description,
        vendorId: req.user?._id
    });

    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    );
});

const getAllProducts = asyncHandler(async (req, res) => {
    let filter = {};
    if (!req.isInternal && req.user) {
        filter = { vendorId: req.user._id };
    }
    const products = await Product.find(filter).sort({ name: 1 });
    return res.status(200).json(
        new ApiResponse(200, products, "Products fetched successfully")
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product fetched successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, category, stock, price, expiry, rxRequired, description } = req.body;

    const product = await Product.findOneAndUpdate(
        { _id: id, vendorId: req.user?._id },
        {
            $set: {
                name,
                category,
                stock,
                price,
                expiry,
                rxRequired,
                description
            }
        },
        { new: true }
    );

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, product, "Product updated successfully")
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id, vendorId: req.user?._id });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Product deleted successfully")
    );
});

export {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
}
