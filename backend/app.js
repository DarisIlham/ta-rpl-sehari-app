import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import profileRoutes from "./routes/profile.routes.js" 

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes)
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
