import {Router} from "express"
import {
    createQuestion,
    getQuestionsBySubject,
    updateQuestion,
    deleteQuestion,
    getQuestionsById
} from "../controllers/question.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router()

router.route("/add-question/:subjectId").post(verifyJWT, upload.single("image"), createQuestion);
router.route("/update-question/:questionId").patch(verifyJWT, upload.single("image"), updateQuestion);
router.route("/get-subject-question/:subjectId").get(verifyJWT, getQuestionsBySubject);
router.route("/delete-question/:questionId").post(verifyJWT, deleteQuestion);
router.route("/get-question-by-id/:questionId").get(verifyJWT, getQuestionsById);

export default router;