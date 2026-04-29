import mongoose from "mongoose"
const connectDB=async()=>{
    try{
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        const dbName = process.env.DB_NAME || "pharmacy_app";
        
        const conn = await mongoose.connect(uri, {
            dbName: dbName,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database Name: ${conn.connection.name}`);

    }
    catch(error){
        console.error("MongoDB connection failed",error.message);
        process.exit(1);

    }
}
export default connectDB;
