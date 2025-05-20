import { Request, Response, Router } from "express";
import authenticateUser from "../middleware/authenticateUser";

const router = Router();

/**
 * Protected Route Example
 */
router.get("/me", authenticateUser, (req: Request, res: Response) => {
  const user = req.user;
  console.log(user)
  res.status(200).json({ user });
});

export default router;

