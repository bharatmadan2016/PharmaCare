import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: true, // This allows requests from any origin with credentials
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
