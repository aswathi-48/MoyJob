import express from "express";
import { fetchSubscribedUsers, subscribeToCompany } from "../controllers/v1/companyController.js";
const router = express.Router();

router.post("/subscribe", subscribeToCompany);
router.post('/subscribedUsers',fetchSubscribedUsers)

export default router;
