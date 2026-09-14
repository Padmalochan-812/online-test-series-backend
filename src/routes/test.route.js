import { Router } from "express";
import { 
    createTest,
    updateTest,
    getAllTest,
    getTestById,
    deleteTest
} from "../controllers/test.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
 
const router = Router()

router.route("/create-test/:id").post(verifyJWT, createTest);
router.route("/update-test/:testId").patch(verifyJWT, updateTest);
router.route("/get-all-test/:testSeriesId").get(verifyJWT, getAllTest);
router.route("/get-test/:testId").get(verifyJWT, getTestById);
router.route("/delete-test/:testId").post(verifyJWT, deleteTest);

export default router;