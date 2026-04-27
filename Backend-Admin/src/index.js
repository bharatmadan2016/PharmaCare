import connectDB from "./config/mongo.config.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

// Start server only after DB connects
connectDB()
.then(() => {
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error(" DB connection error:", err);
});

