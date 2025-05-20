import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { createClient, User } from "@supabase/supabase-js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth"
import dashboardRoutes from "./routes/dashboard"
import userRoutes from "./routes/users"

dotenv.config();
const app = express();
const PORT = 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

export default supabase;

// Extend Express request to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

// Global Middleware
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));


app.use("/auth", authRoutes)
app.use("/dashboard", dashboardRoutes)
app.use("/users", userRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
