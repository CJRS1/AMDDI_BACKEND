import { Router } from "express";
import {
    crearAdmin,
} from "../controllers/admins.controller.js";

export const adminsRouter = Router();
adminsRouter.post("/admins", crearAdmin);