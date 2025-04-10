import express, { Express } from "express";

const app: Express = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ---------------- AUTH ----------------
// register - Post
// login - Post
// logout - Post

// ---------------- SOCIETY ----------------
// createSoc - Post
// createRecruitmentDrive - Post
// addAdmin - Post

// ---------------- RECRUITMENT DRIVE ----------------
// createPortfolio - Post
// editPortfolio - 
// deletePortfolio - 

// ---------------- PORTFOLIO ----------------
// createForm - involves creating questions
// editForm - involves editing questions
// addReviewers

// ----------------- FORM -------------------
// createForm - create a form
// editForm - edit a form
// Forms - Get all Forms
// GetForm

// ---------------- APPLICATIONS ----------------
// addFeedback - comment, score
// editFeedback
// deleteFeedback
// setApplicationStatus

// ---------------- APPLICANT ----------------
// submitApplication
// 

// ----------------- PROFILE -------------------------

// EditProfile
//

