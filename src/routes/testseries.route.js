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

router.route("/create-test-series").post(verifyJWT,CreateTestSeries);
router.route("/update-test-series").patch(verifyJWT, UpdateTestSeries);
router.router("/update-banner").patch(verifyJWT, upload.single("banner"), updated banner);
router.route ("/get-allTest-series ").post(verifyJWT, GetAllTestSeries;)

