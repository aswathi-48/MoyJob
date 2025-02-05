import { Router } from "express";
import { description, requirments, skills } from "../controllers/test/testController.js";



const router = Router()

router.post('/requirments',requirments)
router.post('/description',description)
router.post('/skills',skills)
export default router