import { Request, Response, Router } from "express";
import supabase from "../app";
import authenticateUser from "../middleware/authenticateUser";


const router = Router();

// Route to create a new portfolio
router.post('/create', authenticateUser, async (req:any, res:any) => {
  const { name, description, driveId } = req.body; // Assuming the request body contains the portfolio name and society ID

  if (!name || !driveId) {
    return res.status(400).json({ error: 'Name and Society ID are required.' });
  }

  //check if the society that the drive belonds to has the current user as an admin

  try {
    const { data, error } = await supabase
      .from('portfolios') // Replace with your actual table name
      .insert([{ name, drive: driveId, description, min_capacity: 0, max_capacity: 10 }]); // Adjust the column names as per your schema

    if (error) {
      console.error("Error creating portfolio:", error);
      return res.status(500).json({ error: 'Error creating portfolio.' });
    }

    res.status(201).json({ message: 'Portfolio created successfully.', portfolio: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update the driveId of an existing portfolio
router.patch('/update-drive/:portfolioId', authenticateUser, async (req: any, res: any) => {
  const { portfolioId } = req.params;
  const { driveId } = req.body;

  if (!driveId) {
    return res.status(400).json({ error: 'driveId is required.' });
  }

  try {
    // Optionally: you can check if the portfolio exists before updating
    const { data: existingPortfolio, error: fetchError } = await supabase
      .from('portfolios')
      .select('id, drive')
      .eq('id', portfolioId)
      .single();

    if (fetchError) {
      console.error("Error fetching portfolio:", fetchError);
      return res.status(404).json({ error: 'Portfolio not found.' });
    }

    // Update the driveId
    const { data, error } = await supabase
      .from('portfolios')
      .update({ drive: driveId })
      .eq('id', portfolioId);

    if (error) {
      console.error("Error updating driveId:", error);
      return res.status(500).json({ error: 'Error updating driveId.' });
    }

    res.status(200).json({ message: 'Drive ID updated successfully.', portfolio: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;