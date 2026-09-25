import {Router} from "express"
import {
    createQuestion,
    getQuestionsBySubject,
    updateQuestion,
    deleteQuestion
} from "../controllers/question.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router()

router.route("/add-question/:subjectId").post(verifyJWT, upload.single("image"), createQuestion);
router.route("/update-question/:questionId").patch(verifyJWT, updateQuestion);
router.route("/get-subject-question/:subId").get(verifyJWT, getQuestionsBySubject);
router.route("/delete-question/:questionId").post(verifyJWT, deleteQuestion);

export default router;