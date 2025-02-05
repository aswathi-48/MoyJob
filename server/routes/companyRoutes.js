import { Router } from "express";
import { addCompany, deleteCompany, editCompany, listCompany, viewCompany } from "../controllers/v1/companyController.js";
// import { authCheck, authCheckforadmin } from "../middlewares/authCheck.js";
import authCheck from "../middlewares/authCheck.js";
import { mailSend } from "../controllers/v1/emailController.js";

const router = Router()

router.post('/list',listCompany)
router.use(authCheck)
router.post('/add',addCompany)
router.post('/view', viewCompany)
router.patch('/delete',deleteCompany)
router.patch('/edit',editCompany)
router.post('/mail',mailSend)
// router.post('/data',sendJobPostsToUsers)
export default router