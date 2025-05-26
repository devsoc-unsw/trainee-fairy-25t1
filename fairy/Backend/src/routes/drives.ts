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


router.post('/form/create', authenticateUser, async (req: any, res: any) => {
  console.log("Drive creation route hit");

  const { driveId, questions, societyId } = req.body;

  if (!driveId || !questions) {
    return res.status(400).json({ error: 'driveID and Questions are required.' });
  }

  try {
    // Flattened array of question insertions
    const questionInserts: any[] = [];

    questions.forEach((question: any, index: number) => {
      question.portfolios.forEach((portfolioId: string) => {
        questionInserts.push({
          label: question.question,
          is_required: question.required,
          order_index: index,
          portfolio: portfolioId
        });
      });
    });

    const { data, error } = await supabase
      .from('questions')
      .insert(questionInserts)
      .select('id');

    if (error) {
      console.error("Error creating questions:", error);
      return res.status(500).json({ error: 'Error creating questions.' });
    }

    res.status(201).json({ message: 'Form created successfully.', questions: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
