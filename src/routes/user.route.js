import { Router } from "express";
import { 
    logoutUser,
    loginUser,
    registerUser, 
    refreshAccessToken, 
    ChangeCurrentPassword, 
    userProfile, 
    updateUserDetails, 
    updateAvatar 
} from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();


router.route("/register").post(
    upload.single("avatar"),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes 

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, ChangeCurrentPassword)
router.route("/current-user").get(verifyJWT, userProfile)
router.route("/update-account").patch(verifyJWT, updateUserDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)



export default router ;