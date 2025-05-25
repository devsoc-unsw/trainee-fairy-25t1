import { Request, Response, Router } from "express";
import authenticateUser from "../middleware/authenticateUser";
import supabase from "../app";
import { User } from "@supabase/supabase-js";


const router = Router();



/**
 * Protected Route Example
 */
router.get("/protected/dashboard", authenticateUser, (req: Request, res: Response) => {
  const user = req.user;
  console.log(req.user);
  res.status(200).json({ message: `Welcome ${user?.email}`, user });
});

router.get("/protected/applications/:driveId", authenticateUser, async(req: Request, res: Response) => {
    const user = req.user;
    const driveId = req.params.driveId;
    console.log('User:', user);
    console.log('Drive ID:', driveId);
    
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const userId = (user as User).id;
    const { data: drives, error } = await supabase.rpc('get_director_drives', { uid: user.id });

    if (error) {
        console.error('Error checking director drives:', error);
        res.status(500).json({ error: "Error checking director drives" });
        return;
    }
    console.log('Drives:', drives);
    // check if driveid is in drives array
    if (!drives || !drives.some((drive: any) => drive.d_id === driveId)) {
        res.status(403).json({ error: "Forbidden: You do not have access to this drive" });
        return;
    }

    // Here you would typically fetch the applications for the user and driveId
    const { data: applications, error: fetchError } = await supabase.rpc('get_applications_table_by_drive', {did: driveId});
    if (fetchError) {
        console.error('Error fetching applications:', fetchError);
        res.status(500).json({ error: "Error fetching applications" });
        return;
    }
    // For demonstration, we will return a mock response
    res.status(200).json({
        applications // Replace with actual application data
    });
});

// Update application status
router.post("/protected/applications/status", authenticateUser, async (req: Request, res: Response) => {
    const user = req.user;
    const { id: applicationId, status } = req.body;

    if (!user || !applicationId || !status) {
        res.status(400).json({ error: "User, Application ID and Status are required" });
        return;
    }

    console.log(applicationId, status)

    // TODO: need to make sure the user is a director of the portfolio the application belongs to
    // // Check if the application belongs to the user
    // const { data: application, error: appError } = await supabase
    //     .from('applications')
    //     .select('*')
    //     .eq('id', applicationId)
    //     .eq('user_id', user.id)
    //     .single();

    // if (appError || !application) {
    //     res.status(403).json({ error: "Forbidden: You do not have access to this application" });
    //     return;
    // }

    // Update the status of the application
    const { error: updateError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

    if (updateError) {
        res.status(500).json({ error: updateError.message });
        return;
    }

    res.status(200).json({ message: "Application status updated successfully" });
});

export default router;
