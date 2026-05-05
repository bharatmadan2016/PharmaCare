import express from "express"
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser"
import router from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();

const parseOrigins = (value = "") =>
    value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'https://pharma-care-tan.vercel.app',
            'https://insightful-benevolence-production-2ef7.up.railway.app',
            'https://pharma-care-i8y23kyhk-bharatmadan2016s-projects.vercel.app',
            ...parseOrigins(process.env.FRONTEND_URL),
            ...parseOrigins(process.env.CORS_ORIGINS),
        ];
        if (
            !origin ||
            allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            origin.endsWith('.up.railway.app')
        ) {
            callback(null, true);
        } else {
            console.error("CORS Error: Origin not allowed:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
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

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Route not found",
    });
});

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
