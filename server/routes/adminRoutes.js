import { Router } from "express";
import {  login, register } from "../controllers/v1/adminController.js";
import { authCheck, authCheckforadmin } from "../middlewares/authCheck.js";
import { upload } from "../middlewares/multer/fileUpload.js";



const router = Router()


router.post('/register',upload.single("image"),register)
router.post('/login',login)
router.use(authCheckforadmin)

export default router