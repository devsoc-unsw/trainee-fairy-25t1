import { Request, Response, Router } from "express";
import authenticateUser from "../middleware/authenticateUser";
import supabase from "../app";

const router = Router();

router.get(
  "/drives",
  authenticateUser,
  async (req: Request, res: Response) => {
    try {
        console.log("Fetching drives for user...");
if (!req.user) {
res.status(401).json({ error: "Unauthorized" });
return;
  }

  const userId = req.user.id;
  console.log("User ID:", userId);

const { data: drives, error } = await supabase
  .rpc('get_director_drives', { uid: userId });

      if (error) {
        console.error("Error fetching drives:", error);
        res.status(500).json({ error: error.message });
        return;
      }

      res.status(200).json({ drives });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Unexpected error" });
    }
  }
);


// router.get("/drives", authenticateUser, async (req: Request, res: Response) => {
//   let { data: drives, error } = await supabase
//     .from('society_drives')
//     .select('*');

//   if (error) {
//     res.status(500).json({ error: error.message });
//     return;
//   }
//   res.status(200).json({ drives });
// });
export default router;