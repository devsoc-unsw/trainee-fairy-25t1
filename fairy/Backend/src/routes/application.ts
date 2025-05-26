import { Request, Response, Router } from "express";
import authenticateUser from "../middleware/authenticateUser";
import supabase from "../app";
import { User } from "@supabase/supabase-js";


const router = Router();

router.get("/:applicationId", authenticateUser, async (req: Request, res: Response) => {
    console.log("Fetching application details...");
    const user = req.user as User;
    const applicationId = req.params.applicationId;

    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    
    // fetch appliation details with get_application_questions_answers(app_id)
    const { data: application, error: fetchError } = await supabase.rpc('get_application_questions_answers', { app_id: applicationId });
    if (fetchError) {
        console.error('Error fetching application:', fetchError);
        res.status(500).json({ error: "Error fetching application" });
        return;
    }
    // For demonstration, we will return a mock response
    res.status(200).json({
      application // Replace with actual application data 
    })
});

export default router;