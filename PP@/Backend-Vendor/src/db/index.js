import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        const dbName = process.env.DB_NAME || DB_NAME; // Fallback to constant

        const connectionInstance = await mongoose.connect(uri, {
            dbName: dbName
        });
        
        console.log(`\n✅ MongoDB connected !!`);
        console.log(`📁 DB HOST: ${connectionInstance.connection.host}`);
        console.log(`📁 DB NAME: ${connectionInstance.connection.name}`);
    } catch (error) {
        console.log("❌ MONGODB connection FAILED ", error);
        process.exit(1);
    }
}

export default connectDB;
