import { Router } from "express";

import { getCurrnetUser, loginUser, logOutUser, passwordUpdate, refreshAccessToken, registerUser,
   updateUserInfo , updateAvtarInfo ,updateCoverInfo, getUserChanelProfile, getWatchHistory} 
   from "../controllers/user.controller.js";

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
router.route("/updateUserInfo").patch(verifyJWT, updateUserInfo)
router.route("/updateAvatarInfo").patch(verifyJWT,upload.single("UpdateAvatar"),updateAvtarInfo)
router.route("/updateCoverInfo").patch(verifyJWT,upload.single("UpdateCoverImage"),updateCoverInfo)
router.route("/chanelProfile/:userName").get(verifyJWT,getUserChanelProfile)
router.route("/UserWatchHistory").get(verifyJWT,getWatchHistory)

export default router; // you can give any name of your choice in import if export if default.