import mongoose from "mongoose"
const connectDB=async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        })
        console.log(`DB connected: ${conn.connection.host}/${conn.connection.name}`)

    }
    catch(error){
        console.error("MongoDB connection failed",error.message);
        process.exit(1);

    }
}
export default connectDB;
