import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.js"

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

export default router; // you can give any name of your choice in import if export if default.