import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Vendor } from './src/models/vendor.model.js';

dotenv.config({ path: './.env' });

const seedVendor = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DB_NAME}`);
        console.log("Connected to MongoDB");

        // Delete existing demo vendor if any
        await Vendor.deleteOne({ email: 'vendor@demo.com' });

        const demoVendor = new Vendor({
            pharmacyName: 'PharmaCare Demo',
            ownerName: 'Admin User',
            email: 'vendor@demo.com',
            password: 'vendor123',
            phone: '1234567890'
        });

        await demoVendor.save();
        console.log("Demo Vendor created successfully!");
        console.log("Email: vendor@demo.com");
        console.log("Password: vendor123");

        await mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding vendor:", error);
        process.exit(1);
    }
};

seedVendor();
