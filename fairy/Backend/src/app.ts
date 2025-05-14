import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { createClient, User } from "@supabase/supabase-js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_KEY || ""
);

// Extend Express request to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

// Middleware
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

/**
 * Middleware to validate the session cookie and attach user info to the request object
 */
const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.access_token;
    console.log(token)
    if (!token) {
      res.status(401).json({ error: "Unauthorized. No token provided." });
      return;
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      res.status(401).json({ error: "Invalid or expired token." });
      return;
    }

    req.user = data.user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


/**
 * Signup Route
 */
app.post("/signup", async (req: any, res: any) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName }
    }
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: "Signup successful" });
});

/**
 * Login Route - sets the access_token in HttpOnly cookie
 */
app.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session) {
    return res.status(401).json({ error: error?.message || "Invalid credentials." });
  }

  // Set HttpOnly cookie
  res.cookie("access_token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  const displayName = data.user.user_metadata?.display_name;

  res.status(200).json({ message: "Login successful", displayName });
});

/**
 * Protected Route Example
 */
app.get("/protected/dashboard", authenticateUser, (req: Request, res: Response) => {
  const user = req.user;
  res.status(200).json({ message: `Welcome ${user?.email}`, user });
});

/**
 * Logout Route - clears the access_token cookie
 */
app.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  res.status(200).json({ message: "Logged out successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
