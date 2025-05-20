import { Request, Response, NextFunction } from "express";
import supabase from "../app";

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

export default authenticateUser