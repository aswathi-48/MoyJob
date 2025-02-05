import { Router } from "express"
import { addSkill, editSkill, skillList } from "../controllers/v1/skillController.js"
import { uploads } from "../middlewares/multer/fileUpload.js"

const router = Router()

router.post('/add',uploads.single('cv') , addSkill)
router.post('/list', skillList)
router.post('/edit', editSkill)

export default router 