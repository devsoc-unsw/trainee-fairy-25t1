import { Request, Response, Router } from "express";
import supabase from "../app";


const router = Router();

/**
 * Signup Route
 */
router.post("/signup", async (req: any, res: any) => {
  const { email, password, data } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  console.log(data)
  const { data: user, error: signupError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        student_id: data.student_id,
        degree: data.degree,
        gender: data.gender, // Ensure this matches your Gender enum
        study_year: parseInt(data.study_year),
        is_pg: data.is_pg,
        is_intl: data.is_intl,
      }
    }
  });

  if (signupError) {
    console.error("Signup error:", signupError.message); 
  } else {
    console.log('Signup Data:', { user });

  }
  

  res.status(200).json({ message: "Signup successful" });
});

/**
 * Login Route - sets the access_token in HttpOnly cookie
 */
router.post("/login", async (req: any, res: any) => {
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
 * Logout Route - clears the access_token cookie
 */
router.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });
  res.status(200).json({ message: "Logged out successfully" });
});


export default router;