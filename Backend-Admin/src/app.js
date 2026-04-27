import express from "express"
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import router from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://pharma-care-tan.vercel.app',
        'https://insightful-benevolence-production-2ef7.up.railway.app',
        'https://pharma-care-i8y23kyhk-bharatmadan2016s-projects.vercel.app',
    ],
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(morgan("dev"));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Admin Backend is running");
});

app.use("/api/v1/users", router);
app.use("/api/v1/admin", adminRouter);

app.use((err, req, res, next) => {
    console.error(err);
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    const errors = err.errors || [];

    if (err.name === "MongoServerError" && err.code === 11000) {
        const field = Object.keys(err.keyValue || {}).join(", ");
        message = `${field || "Duplicate field"} already exists`;
        statusCode = 409;
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
    });
});

export default app;