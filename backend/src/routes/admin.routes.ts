import { Router } from "express";
import adminController from "../controllers/admin.controller";

const adminRoutes = Router();

adminRoutes.post("/login", adminController.login);

export default adminRoutes;
