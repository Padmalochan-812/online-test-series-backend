import {Router} from "express"
import {
    addSubject,
    updateSubject,
    getAllSubject,
    getSubjectById,
    deleteSubject
} from "../controllers/subject.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/add-subject/:testId").post(verifyJWT, addSubject);
router.route("/update-subject/:subjectId").patch(verifyJWT, updateSubject);
router.route("/get-all-subject/:testId").get(verifyJWT, getAllSubject);
router.route("/get-subject/:subId").get(verifyJWT, getSubjectById);
router.route("/delete-subject/:subjectId").post(verifyJWT, deleteSubject);

export default router;