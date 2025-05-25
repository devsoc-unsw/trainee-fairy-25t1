import { Request, Response, Router } from "express";
import authenticateUser from "../middleware/authenticateUser";
import supabase from "../app";

const router = Router();

router.get("/me", authenticateUser, async (req: any, res: any) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = req.user.id;

  try {
    // 1. Admin societies
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select(`
        society (
          id,
          name,
          description,
          drives (
            id,
            name,
            portfolios (
              id,
              name,
              description,
              min_capacity,
              max_capacity
            )
          )
        )
      `)
      .eq("user_id", userId);

    if (adminError) {
      console.error("Error fetching admin societies:", adminError);
      return res.status(500).json({ error: "Error fetching admin societies" });
    }

    const adminSocieties = adminData?.map((admin: any) => {
      const society = admin.society;

      // flatten portfolios from all drives inside this society
      const portfolios: any[] = [];
      const drives = society.drives?.map((drive: any) => {
        if (drive.portfolios?.length) {
          portfolios.push(...drive.portfolios);
        }
        return { id: drive.id, name: drive.name };
      }) || [];

      // remove duplicates portfolios by id (just in case)
      const uniquePortfolios = Array.from(
        new Map(portfolios.map(p => [p.id, p])).values()
      );

      return {
        id: society.id,
        name: society.name,
        description: society.description,
        user_role: "Admin",
        drives,
        portfolios: uniquePortfolios,
      };
    }) || [];

    // 2. Director societies
    const { data: directorData, error: directorError } = await supabase
      .from("directors")
      .select(`
        portfolio (
          id,
          name,
          description,
          min_capacity,
          max_capacity,
          drive (
            id,
            name,
            portfolios (
              id,
              name,
              description,
              min_capacity,
              max_capacity
            ),
            society (
              id,
              name,
              description
            )
          )
        )
      `)
      .eq("user_id", userId);

    if (directorError) {
      console.error("Error fetching director societies:", directorError);
      return res.status(500).json({ error: "Error fetching director societies" });
    }

    const directorSocieties: any[] = [];

    directorData?.forEach((entry: any) => {
      const portfolio = entry.portfolio;
      const drive = portfolio?.drive;
      const society = drive?.society;

      if (society && drive) {
        const societyId = society.id;
        const existingIndex = directorSocieties.findIndex((s) => s.id === societyId);

        // flatten all portfolios inside the drive for this society
        const portfoliosInDrive = drive.portfolios || [];

        if (existingIndex !== -1) {
          // add drives if not present
          const existingSociety = directorSocieties[existingIndex];

          if (!existingSociety.drives.some((d: any) => d.id === drive.id)) {
            existingSociety.drives.push({ id: drive.id, name: drive.name });
          }

          // add portfolios, avoid duplicates
          portfoliosInDrive.forEach((p: any) => {
            if (!existingSociety.portfolios.some((existingP: any) => existingP.id === p.id)) {
              existingSociety.portfolios.push(p);
            }
          });
        } else {
          directorSocieties.push({
            id: society.id,
            name: society.name,
            description: society.description,
            user_role: "Director",
            drives: [{ id: drive.id, name: drive.name }],
            portfolios: portfoliosInDrive,
          });
        }
      }
    });

    // 3. Combine all societies
    const allSocieties = [...adminSocieties, ...directorSocieties];

    return res.status(200).json({
      user: req.user,
      societies: allSocieties,
    });

  } catch (err) {
    console.error("Error in /me route:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
