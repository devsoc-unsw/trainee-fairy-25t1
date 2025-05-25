import { Request, Response, Router } from "express";
import authenticateUser from "../middleware/authenticateUser";

const router = Router();

/**
 * Protected Route Example
 */
router.get("/protected/dashboard", authenticateUser, (req: Request, res: Response) => {
  const user = req.user;
  console.log(req.user);
  res.status(200).json({ message: `Welcome ${user?.email}`, user });
});

export default router;
