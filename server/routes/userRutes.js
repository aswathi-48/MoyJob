import { Router } from "express";
import { authConfirmTest, deleteUser, editUser, getClientUsers, getUser, login, register } from "../controllers/v1/userController.js";
import { check } from "express-validator";
import { upload } from "../middlewares/multer/fileUpload.js";
import authCheck from "../middlewares/authCheck.js";

const router = Router()

router.post('/register',upload.single("image"),register)
router.post('/login',login)
router.post('/clients',getClientUsers)
router.use(authCheck)
router.post('/test_auth_check', authConfirmTest)
router.post('/profile',getUser)
router.patch('/delete',deleteUser)
router.patch('/edit',editUser)

export default router