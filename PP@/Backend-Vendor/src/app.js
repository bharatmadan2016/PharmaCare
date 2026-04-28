import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:5175',
            'https://pharma-care-tan.vercel.app',  
            'https://pharmacare-production-b6cf.up.railway.app',
            'https://pharma-care-i8y23kyhk-bharatmadan2016s-projects.vercel.app',
        ];
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.error("CORS Error: Origin not allowed:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

// Request Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// ✅ Root route add kiya
app.get("/", (req, res) => {
    res.send("Vendor Backend is running ✅");
});

//routes import
import dashboardRouter from './routes/dashboard.routes.js'
import orderRouter from './routes/order.routes.js'
import productRouter from './routes/product.routes.js'
import vendorRouter from './routes/vendor.routes.js'
import pharmacyRouter from './routes/pharmacy.routes.js'

//routes declaration
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/orders", orderRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/vendors", vendorRouter)
app.use("/api/v1/pharmacies", pharmacyRouter)

// 404 handler for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Route not found",
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    const errors = err.errors || [];

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors
    });
});

export { app }