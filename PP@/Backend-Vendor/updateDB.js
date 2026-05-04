import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const vendorSchema = new mongoose.Schema({
    email: String,
    status: String,
    role: String
}, { strict: false });

const Vendor = mongoose.model("Vendor", vendorSchema);

async function migrate() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        console.log("Connected successfully.");

        const vendors = await Vendor.find({});
        console.log(`Found ${vendors.length} vendors. Starting migration...`);

        let updatedCount = 0;
        for (const vendor of vendors) {
            let modified = false;

            // 1. Lowercase email
            if (vendor.email && vendor.email !== vendor.email.toLowerCase()) {
                vendor.email = vendor.email.toLowerCase();
                modified = true;
            }

            // 2. Set default status if missing
            if (!vendor.status) {
                vendor.status = "pending";
                modified = true;
            }

            // 3. Set role if missing
            if (!vendor.role) {
                vendor.role = "Vendor";
                modified = true;
            }

            if (modified) {
                await vendor.save();
                updatedCount++;
            }
        }

        console.log(`Migration complete. Updated ${updatedCount} records.`);
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
