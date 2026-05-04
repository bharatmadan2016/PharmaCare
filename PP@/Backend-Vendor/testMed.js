import mongoose from "mongoose";
import dotenv from "dotenv";
import { Order } from "./src/models/order.model.js";
import { Product } from "./src/models/product.model.js";
import { Vendor } from "./src/models/vendor.model.js";

dotenv.config({ path: "./.env" });

const seedDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DB_NAME}`);
        console.log("Connected to MongoDB for seeding");
        
        // 1. Create/Update Demo Vendor
        await Vendor.deleteOne({ email: 'vendor@demo.com' });
        const demoVendor = await Vendor.create({
            pharmacyName: 'PharmaCare Demo',
            ownerName: 'Admin User',
            email: 'vendor@demo.com',
            password: 'vendor123',
            phone: '1234567890',
            status: 'approved',
            location: {
                type: 'Point',
                coordinates: [77.2090, 28.6139] // Delhi coordinates
            }
        });
        console.log("Demo Vendor created");

        // 2. Create/Update another Pharmacy for comparison
        await Vendor.deleteOne({ email: 'medplus@demo.com' });
        const compVendor = await Vendor.create({
            pharmacyName: 'MedPlus Neighborhood',
            ownerName: 'Sarah Smith',
            email: 'medplus@demo.com',
            password: 'vendor123',
            phone: '9876543210',
            status: 'approved',
            location: {
                type: 'Point',
                coordinates: [77.2167, 28.6448] // Slightly further
            }
        });
        console.log("Competition Vendor created");

        // 3. Seed Products
        await Product.deleteMany({});
        const products = [
            {
                name: 'Azithromycin 250mg',
                vendorId: demoVendor._id,
                rxRequired: true,
                category: 'Antibiotic',
                stock: 45,
                expiry: '2025-12-31',
                price: 250,
                description: 'Commonly used to treat infections.'
            },
            {
                name: 'Azithromycin 250mg',
                vendorId: compVendor._id,
                rxRequired: true,
                category: 'Antibiotic',
                stock: 20,
                expiry: '2025-11-30',
                price: 220, // Cheaper!
                description: 'Commonly used to treat infections.'
            },
            {
                name: 'Ibuprofen 200mg',
                vendorId: demoVendor._id,
                rxRequired: false,
                category: 'Pain Relief',
                stock: 120,
                expiry: '2026-06-30',
                price: 45,
                description: 'NSAID used for pain relief.'
            },
            {
                name: 'Paracetamol 500mg',
                vendorId: demoVendor._id,
                rxRequired: false,
                category: 'Fever',
                stock: 500,
                expiry: '2026-10-30',
                price: 15,
                description: 'General purpose fever medicine.'
            },
            {
                name: 'Paracetamol 500mg',
                vendorId: compVendor._id,
                rxRequired: false,
                category: 'Fever',
                stock: 300,
                expiry: '2026-12-30',
                price: 12, // Cheaper!
                description: 'General purpose fever medicine.'
            }
        ];
        
        await Product.insertMany(products);
        console.log("Products seeded successfully");

        await Order.deleteMany({});
        console.log("Old orders cleared");
        
        process.exit(0);
    } catch (error) {
        console.log("Seeding failed: ", error);
        process.exit(1);
    }
};

seedDB();
