import { Router  } from "express";
import {
    CreateTestSeries,
    UpdateTestSeries,
    UpdateBanner,
    GetAllTestSeries,
    GetTestSeriesById
} from "../controllers/test_series.controllers.js"

import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/create-test-series").post(verifyJWT,upload.single("banner"), CreateTestSeries);
router.route("/update-test-series/:id").patch(verifyJWT, UpdateTestSeries);
router.route("/update-banner").patch(verifyJWT, upload.single("banner"), UpdateBanner);
router.route ("/get-all-test-series").post(verifyJWT, GetAllTestSeries)
router.route("/get-test-series-by-id").get(verifyJWT, GetTestSeriesById)

export default router;