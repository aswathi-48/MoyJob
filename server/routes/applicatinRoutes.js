import { Router } from "express";
import { uploads } from "../middlewares/multer/fileUpload.js";
import { addApplication, listApplications, listScheduledInterviews } from "../controllers/v1/applicationController.js";
import authCheck from "../middlewares/authCheck.js";

const router = Router()


router.post('/list',listApplications)
router.post('/interview',listScheduledInterviews)

router.use(authCheck)

router.post('/add', uploads.single('cv'), addApplication)
export default router