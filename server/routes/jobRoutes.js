import { Router, application } from "express";
import authCheck from "../middlewares/authCheck.js";
import { addJobs, deleteJobs, editJob, listJobs, listLatestJobs, viewJob } from "../controllers/v1/jobController.js";

const router = Router()
router.post('/list',listJobs)
router.use(authCheck)
router.post('/add',addJobs)
router.post('/view',viewJob)
router.patch('/delete',deleteJobs)
router.patch('/edit',editJob)
router.post('/latest',listLatestJobs)
export default router