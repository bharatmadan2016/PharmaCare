import connectDB from "./config/mongo.config.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 9000;

// Start server only after DB connects
connectDB()
.then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error(" DB connection error:", err);
});

