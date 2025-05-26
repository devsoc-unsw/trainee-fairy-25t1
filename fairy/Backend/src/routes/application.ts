import { Request, Response, Router } from "express";
import authenticateUser from "../middleware/authenticateUser";
import supabase from "../app";
import { User } from "@supabase/supabase-js";


const router = Router();
