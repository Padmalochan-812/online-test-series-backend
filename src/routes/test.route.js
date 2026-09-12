import { Router } from "express";
import { 
    createTest,
    updateTest,
    getAllTest
} from "../controllers/test.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
 
const router = Router()

router.route("/create-test/:id").post(verifyJWT, createTest);
router.route("/update-test/:testId").patch(verifyJWT, updateTest);
router.route("/get-all-test/:testSeriesId").get(verifyJWT, getAllTest);


export default router;