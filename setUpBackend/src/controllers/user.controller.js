// import { asyncHandler } from "../utils/asyncHandler";
// import express from "express"

import { uploadOnCloudinary } from "../config/cloudinary.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";

const registerUser=async(req,res,next)=>{
  try{
   /*
      // get user details from frontend
      // validation - not empty
      // check if user already exist : username or email
      // check for images, check for avatar
      // upload them to cloudinary, check for avatar
      // create user object -create entry in db
      // remove password and refresh token field from responce
      // check for user creation
      // return res
    */

    // if request is coming from {form or json } req.body will have data 
    


  //  get user details from frontend

    const {userName,fullName,email,password}=req.body // de-structure of req.body
    console.log(`"email",${email},"fullNAme",${fullName}`);
      

    
  // validation - not empty

      /*
      if(fullName==""){
        throw new ApiError(400,"Fill the fullName");
      }
      */

    if(
      [fullName,userName,email,password].some((field)=>{
        return !field?.trim();  
      })
    ){
      throw new ApiError(400,"Pls fill required details")
    }
      /*
          //                     ? (optional chain)
      field?. → "Only try to access .trim() if field is not null or undefined."


         The .some() method in JavaScript is an array method that checks if at least one element in the array satisfies a
            given condition (returns true).

            If it finds even one matching element, it immediately stops and returns true.
            If no elements satisfy the condition, it returns false.


          // "" -> false, :"abc" -> true converted into {!"abc"} false
       
        If field = " " →
            field.trim() becomes "" →
            !"" → true → error gets thrown ✅

            If field = "" →
            !"" → true → error gets thrown ✅

            !undefined   // undefined is falsy, so !undefined → true
      */


  // check if user already exist : username or email

    const existedUser = await User.findOne({
      $or:[{ userName },{ email }]
    })  
    if(existedUser){
      throw new ApiError(409,"User username or email already existed")
      /*
        //
        $or means: "Find a document where at least one of these conditions is true."
        { userName } means: find where the userName field equals the value of the variable userName.
        { email } means: find where the email field equals the value of the variable email.
      */
    }
    
  // check for images, check for avatar // this is on server side
      // we get middleware access of multer. in request

    const avatarLocalPath=req.files?.avatar[0]?.path
    /*
      req.files
      This comes from Multer (or another file upload middleware).

        If you uploaded files, req.files will be an object or array containing details about them.
        If no files were uploaded, it will be undefined.

      req.files?.avatar
      The ?. says:

        If req.files exists, access avatar.
        If not, return undefined instead of throwing an error.
        avatar here is likely the field name in your upload form, e.g. <input type="file" name="avatar">.
        With Multer’s fields() method, avatar will be an array of files for that field.

      req.files?.avatar[0]

        [0] means: get the first file uploaded in the avatar field.
        If no files were uploaded in that field, req.files?.avatar will be undefined, and because 
        of the ?. in the next step, it won’t crash.


      req.files?.avatar[0]?.path
      The second ?. says:

        If avatar[0] exists, get its path.
        If it’s undefined, just return undefined instead of throwing “Cannot read property 'path' of 
        undefined”.
    */
    const coverImageLocalPath=req.files?.coverImage[0]?.path
    
    if(!avatarLocalPath){
      throw new ApiError(404,"Avatar file is required")
    }
    if(!coverImageLocalPath){
     throw new ApiError(404,"Cover Image file is required") 
    }

    console.log("req.files:", req.files);
    console.log("Avatar path:", req.files?.avatar?.[0]?.path);
    console.log("Cover path:", req.files?.coverImage?.[0]?.path);



  // // upload them to cloudinary, check for avatar

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // for some reason files couldn't be able to upload
    if(!avatar){
      console.error("Cloudinary upload failed for avatar:", avatarLocalPath);
      throw new ApiError(405,"Avatr image is not uploaded on cloudinary")
    }
    /*  if(!coverImage){
    //   throw new ApiError(505,"Cover image is not uploaded on cloudinary")
    // }
    */


  // create user object -create entry in db    

     const user = await User.create({
      userName:userName.toLowerCase(),
      fullName,
      email,
      password,
      avatar:avatar.url ,
      coverImage:coverImage?.url || "" // for some reason if image is uploaded or not on cloudinary.
      // to stop from code fatna
    })


  // check for user creation
  // remove password and refresh token field from responce

    const createuser = await User.findById(user._id).select("-password -refreshToken")

  // return res
    res.status(201).json(
      new ApiResponse(200,createuser,"User is succesfully created")
    )

  }
  catch(error){
    next(error);
  }
}


export{registerUser}