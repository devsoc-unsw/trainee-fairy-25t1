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
    return;
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
    return;
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
    return;
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

// Get or create an application to a portfolio
router.get("/application/:portfolioId", authenticateUser, async (req: Request, res: Response) => {
  const userId = req.user ? req.user.id : undefined;
  const portfolioId = req.params.portfolioId;

  if (!userId || !portfolioId) {
    res.status(400).json({ error: "User ID and Portfolio ID are required" });
    return;
  }

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .eq('portfolio', portfolioId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.log('failed to get existing application')
    res.status(500).json({ error: error.message });
    return;
  }

  if (data) {
    console.log('found existing application')
    res.json({ application: data });
    return;
  }

  const { data: newApp, error: insertError } = await supabase
    .from('applications')
    .insert({ user_id: userId, portfolio: portfolioId })
    .select()
    .single()

  if (insertError) {
    console.log('failed to create new application')
    res.status(500).json({ error: insertError.message });
    return;
  }
  console.log('created new application', newApp)
  res.json({ application: newApp });
});

router.get("/application/status/:applicationId", authenticateUser, async (req: Request, res: Response) => {
  const userId = req.user ? req.user.id : undefined;
  const { applicationId } = req.params;

  if (!userId || !applicationId) {
    res.status(400).json({ error: "User ID and Application ID are required" });
    return;
  }

  // Check if the application belongs to the user
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .eq('user_id', userId)
    .single();

  if (appError || !application) {
    res.status(403).json({ error: "Forbidden: You do not have access to this application" });
    return;
  }
  
  // Fetch the status of the application
  console.log('asdfasdfasfds')
  console.log(application.submitted_at)
  res.status(200).json({ status: application.submitted_at ? "submitted" : "draft" });
});

// Get all answers for a specific application
router.get("/answers/:applicationId", authenticateUser, async (req: Request, res: Response) => {
  const userId = req.user ? req.user.id : undefined;
  const { applicationId } = req.params;

  if (!userId || !applicationId) {
    res.status(400).json({ error: "User ID and Application ID are required" });
    return;
  }

  // Check if the application belongs to the user
  const { data: application, error: appError } = await supabase
  .from('applications')
  .select('*')
  .eq('id', applicationId)
  .eq('user_id', userId)
  .single();

  if (appError || !application) {
    res.status(403).json({ error: "Forbidden: You do not have access to this application" });
    return;
  }
  
  // Fetch answers for the application
  let { data: answers, error } = await supabase
  .from('answers')
  .select('*')
  .eq('application', applicationId);
  
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(200).json({ answers });
});

// Upsert answers for a specific application
router.post("/answers/submit", authenticateUser, async (req: Request, res: Response) => {
  const userId = req.user ? req.user.id : undefined;
  const { applicationId, answers, isFinalSubmission } = req.body;

  if (!userId || !applicationId || !Array.isArray(answers)) {
    res.status(400).json({ error: "User ID, Application ID, and answers are required" });
    return;
  }

  // Check if the application belongs to the user
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .eq('user_id', userId)
    .single();

  if (appError || !application) {
    res.status(403).json({ error: "Forbidden: You do not have access to this application" });
    return;
  }

  // Upsert answers for the application
  const upsertedAnswers = answers.map(answer => ({
    application: applicationId,
    question: answer.question_id,
    answer: answer.answer,
  }));

  const { data, error } = await supabase
    .from('answers')
    .upsert(upsertedAnswers, { onConflict: 'question, application' })
    .select();

  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }

  if (isFinalSubmission) {
    const { data, error } = await supabase
      .from('applications')
      .update({ submitted_at: new Date(), status: 'pending' })
      .eq('id', applicationId)
      .select()
      .single();
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.status(200).json({ message: "Application submitted successfully", data });
  }
  res.status(200).json({ message: "Draft application saved successfully", data });
});



export default router;

