import { Router } from "express";
import { getPortfolioData } from "../controllers/portfolioController.js";

const router = Router();

// GET /api/portfolio - Returns full published portfolio data
router.get("/", getPortfolioData);

export default router;
