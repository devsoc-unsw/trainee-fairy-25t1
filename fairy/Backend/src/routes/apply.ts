import { Request, Response, Router } from "express";
import authenticateUser from "../middleware/authenticateUser";
import supabase from "../app";

const router = Router();

// Gets all societies and their drives
router.get("/drives", authenticateUser, async (req: Request, res: Response) => {
  let { data: drives, error } = await supabase
    .from('society_drives')
    .select('*');

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json({ drives });
});

// Gets details of a specific society
router.get("/society/:id", authenticateUser, async (req: Request, res: Response) => {
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

// Gets details of a specific drive
router.get("/drive/:id", authenticateUser, async (req: Request, res: Response) => {
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

// Gets all portfolios for a specific drive
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

// Gets details of a specific portfolio
router.get("/portfolio/:portfolioId", authenticateUser, async (req: Request, res: Response) => {
  const { portfolioId } = req.params;

  let { data: portfolio, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', portfolioId)
    .single();

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json({ portfolio });
});

// Gets all questions for a specific portfolio
router.get("/questions/:portfolioId", authenticateUser, async (req: Request, res: Response) => {
  const { portfolioId } = req.params;

  let { data: questions, error } = await supabase
    .from('questions')
    .select('*')
    .eq('portfolio', portfolioId)
    .order('order_index', { ascending: true });

  if (error) {
    res.status(500).json({ error: error.message });
  }
  res.status(200).json({ questions });
});

// 


export default router;

