import { Router } from "express";

import { getCurrnetUser, loginUser, logOutUser, passwordUpdate, refreshAccessToken, 
  registerUser, updateUserInfo , updateAvtarInfo ,updateCoverInfo} from "../controllers/user.controller.js";

import {upload} from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/register").post(
  upload.fields([ 
  // Used when you have multiple different fields for file uploads.
    {
      name:"avatar",
      maxCount:1
    },
    {
      name:"coverImage",
      maxCount:1
    }
  ])
,registerUser)

router.route("/logIn").post(loginUser)

// secure route because token are verified in it.

router.route("/logOut").post(verifyJWT,logOutUser)
router.route("/refreshToken").post(refreshAccessToken)
router.route("/passwordChange").post(verifyJWT,passwordUpdate)
router.route("/currentUser").get(verifyJWT, getCurrnetUser)
router.route("/updateUserInfo").post(verifyJWT, updateUserInfo)
router.route("/updateAvatarInfo").post(verifyJWT,upload.single("UpdateAvatar"),updateAvtarInfo)
router.route("/updateCoverInfo").post(verifyJWT,upload.single("UpdateCoverImage"),updateCoverInfo)



export default router; // you can give any name of your choice in import if export if default.