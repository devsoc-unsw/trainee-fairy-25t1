import { Router, Request, Response } from "express";
import supabase from "../app";
import authenticateUser from "../middleware/authenticateUser";

const router = Router();

router.post('/create', authenticateUser, async (req: any, res: any) => {
  console.log("Drive creation route hit");

  const { name, description, societyId, open_date, close_date } = req.body;

  if (!name || !societyId) {
    return res.status(400).json({ error: 'Name and Society ID are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('drives')
      .insert([{ name, society: societyId, description, open_date, close_date }])
      .select('id');

    if (error) {
      console.error("Error creating drive:", error);
      return res.status(500).json({ error: 'Error creating drive.' });
    }

    res.status(201).json({ message: 'Drive created successfully.', drive: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
