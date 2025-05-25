import { Request, Response, Router } from "express";
import authenticateUser from "../middleware/authenticateUser";
import supabase from "../app";

const router = Router();

router.get("/drives", authenticateUser, async (req: Request, res: Response) => {
  let { data: drives, error } = await supabase
    .from('society_drives')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json({ drives });
});

router.get("/societies/:id", authenticateUser, async (req: Request, res: Response) => {
  const { id: societyId } = req.params;

  let { data: society, error } = await supabase
    .from('societies')
    .select('*')
    .eq('id', societyId)
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json({ society });
});

router.get("/drives/:id", authenticateUser, async (req: Request, res: Response) => {
  const { id: driveId } = req.params;

  let { data: drive, error } = await supabase
    .from('drives')
    .select('*')
    .eq('id', driveId)
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json({ drive });
});

router.get("/portfolios/:driveId", authenticateUser, async (req: Request, res: Response) => {
  const { driveId } = req.params;
  let { data: portfolios, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('drive', driveId);

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json({ portfolios });
});


export default router;

