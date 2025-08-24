// import { asyncHandler } from "../utils/asyncHandler";
// import express from "express"


import mongoose from "mongoose";
import { uploadOnCloudinary , deleteOnCloudinary } from "../config/cloudinary.js";
import { Subscription } from "../models/subscriber.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken"

///////////////////////////////////////////////////////////////////////////////////////////////////

const GenrateAccessAndRefreshToken=async(userId)=>{

  try {

    const user = await User.findById(userId)
    const Acc_token = await user.AcessTokenGen()
    const Ref_token = await user.RefreshTokenGen()
    
    // await user.refreshToken = Ref_token → wrong, because = just assigns a value 
    // immediately in memory. It doesn’t touch MongoDB until you call .save().

    user.refreshToken=Ref_token
  
    // “Save this document to MongoDB, but skip running schema validations before saving.”
    await user.save({validateBeforeSave:false})
  
    return { Acc_token,Ref_token}
    
  } catch (error) {
    throw new ApiError(401,"Problem occurr in genrating AcessToken and Refresh Token")
  }

}

///////////////////////////////////////////////////////////////////////////////////////////////////

const registerUser=async(req,res)=>{
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
 
  // this method is is request have files or not if it does it have avatr file. if it has then give path
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
      avatar:{url: avatar.url , public_id :avatar.public_id},
      coverImage:{url: coverImage.url || "" , public_id :coverImage.public_id || ""} // for some reason if image is uploaded or not on cloudinary.
      // to stop from code fatna
    })


  // check for user creation
  // remove password and refresh token field from responce

    const createuser = await User.findById(user._id).select("-password -refreshToken")

  // return res
    return res.status(201).json(
      new ApiResponse(200,createuser,"User is succesfully created")
    )

  }
  catch(error){
    next(error)
    // throw new ApiError (400,"Something went wrong couldn't able to register User")
  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////



// const loginUser=async(req,res,next)=>{
//   try {
//     /*
//       //to dos
//       // req -> body data 
//       // username or email from db should match 
//       // compare password from db
//       // generate access token and refresh token
//       // remain login untill refresh token get expire
//       // send token in cookies
//     */    

//     // req -> body data 
//     const {userName,email,password}=req.body;
//     console.log("Username is : ",userName);
    

//     // check if user or email isn't empty
//     if(!(userName || email)){
//       throw new ApiError(400,"Provide either username or email")
//     }

//     // find username or email from db is to see is user in database or not
//     const user = await User.findOne({
//       $or:[{userName},{email}]
//     })

//     // check if user exist or not
//     if(!user){
//       throw new ApiError(400,"User doesn't exist")
//     }


//     /*
//     Example of User of model and user of instance

//     User = the bank database → you can search, insert, or query { all accounts } .

//     user = a single customer’s bank account → you can check their balance, withdraw, or 
//     deposit for that { one account }.
//     */


//    // compare password from db

//     const isPasswordvalidate = await user.isPasswordSame(password); // return in boolean
//     if(!isPasswordvalidate){ // if password is incorrect or empty/
//       throw new ApiError(400,"Your Password is incorrect or empty")
//     }

//     const {Acc_token,Ref_token}= await GenrateAccessAndRefreshToken(user._id) // destructure 


//     const options={ 
//       /*
//         By default cookies can modify in frontend or backend
//         // but if httpOnly and secure is true that it can be modify by server side only
//       */
//       httpOnly:true, 
//       secure:true
//     }
//       // AccessToken is key and Acc_token is value.
//       return res.status(200).cookie("AccessToken",Acc_token,options).cookie("RefreshToken",Ref_token,options)
//       .json(
//         new ApiResponse(
//           200,
//           {
//             user: { Acc_token, Ref_token }
//           },"User Logined sucessfully"
//         )
//       )


//   } catch (error) {
//     throw new ApiError(500,"Something went wrong not able to login User")
//   }
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////


const loginUser = async (req, res) =>{
  try {
    
      // req body -> data
      // username or email
      //find the user
      //password check
      //access and referesh token
      //send cookie
  
      const {email, userName, password} = req.body
      console.log(email);
  
      if (!(userName || email)) {
          throw new ApiError(400, "username or email is required")
      }
      
      // Here is an alternative of above code based on logic discussed in video:
      // if (!(username || email)) {
      //     throw new ApiError(400, "username or email is required")
          
      // }
  
      const user = await User.findOne({
          $or: [{userName}, {email}]
      })
  
      if (!user) {
          throw new ApiError(404, "User does not exist")
      }
  
     const isPasswordValid = await user.isPasswordSame(password)
  
     if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials")
      }
  
     const {Acc_token, Ref_token} = await GenrateAccessAndRefreshToken(user._id)
  
      const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  
      const options = {
          httpOnly: true,
          secure: true
      }
  
      return res
      .status(200)
      .cookie("accessToken", Acc_token, options)
      .cookie("refreshToken", Ref_token, options)
      .json(
          new ApiResponse(
              200, 
              {
                  user: loggedInUser, Acc_token, Ref_token
              },
              "User logged In Successfully"
          )
      )
  
  } catch (error) {
    console.error("Login error:", error);
    throw new ApiError (500,"User isn't able to login",error)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

const logOutUser=async function(req,res){
    try {
      
      await User.findByIdAndUpdate(
        req.user._id,
          {
            $unset:{
              refreshToken: 1 // this removes field from document
            },
          },
          { // By default, Mongoose returns the old/original document (before the update).
            new :true // If you add { new: true }, Mongoose will return the updated document instead.
          }
      )

      const options={
        httpOnly:true,
        secure:true
      }

      return res.status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(new ApiResponse(201,{},"User logOut"))


    } catch (error) {
      throw new ApiError(401,"User is not able to logOut")
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

const refreshAccessToken= async(req,res)=>{
  try {
    
    const clientToken = req.cookies?.refreshToken || req.body.refreshToken

    if(!clientToken){
      throw new ApiError(400,"Refresh token is empty")
    }

    const decodeToken = jwt.verify(clientToken,process.env.REFRESH_TOKEN_SECRET)

    if(!decodeToken){
      throw new ApiError(400,"Token is invalid ")
    }

    const dbRefreshToken = await User.findById(decodeToken._id)

    if(clientToken !== dbRefreshToken.refreshToken){
      throw new ApiError(400,"Token doesn't match.  !! Imposter ")
    }

    const {Acc_token,Ref_token} = await GenrateAccessAndRefreshToken(decodeToken._id)

    const options={
      httpOnly:true,
      secure:true
    }

    return res.status(200)
    .cookie("accessToken",Acc_token,options)
    .cookie("refreshToken",Ref_token,options)
    .json(new ApiResponse (201,{},"New Access Token genrated by Refresh token"))



  } catch (error) {
     throw new ApiError(400,error.message)
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

const passwordUpdate =async(req,res)=>{
  try {
    
    const {oldPassword, newPassword , confirmPassword} =req.body

    if(!(oldPassword && newPassword && confirmPassword)){
      throw new ApiError(400,"Please enter old, new and confirm Password")
    }

    const user = await User.findById(req.user._id)

    if(!user) {
      throw new ApiError(401,"Invalid user")
    }

    const samePassword = await user.isPasswordSame(oldPassword)

    if(!samePassword){
      throw new ApiError(400,"Password is invalid")
    }

    if(!(newPassword === confirmPassword)){
      throw new ApiError(400,"New Password is not same as conform Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave :false})


    return res.status(200)
    .json(
      new ApiResponse (201,{},"Password changed successfully"))

  } catch (error) {
    throw new ApiError(400,error?.message || "Couldn't Update Password ")
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////


const getCurrnetUser = async(req,res)=>{

  try {


    const user = await User.findById(req.user._id).select("-password -refreshToken")

    return res.status(200).json({
      status: 200,
      User: user,
      message : " User details"

    })

  } catch (error) {
    throw new ApiError(400, error.message || "Coluldn't get current User")
  }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateUserInfo = async (req,res)=>{
  try {

    const { fullName ,email } = req.body

    if(!(fullName && email)){
      throw new ApiError(400,"Please fill the info {full name and email }")
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          fullName:fullName,
          email:email
        }
      },
      {new:true}
    ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponse (201,{
      User:user,
      message: "Info updated successfully "
    }))

  } catch (error) {
    throw new ApiError(400,error.message || "Couldn't Update User Info")
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateAvtarInfo =async(req,res)=>{
  try {
    

    const user =await User.findById(req.user?._id)

    if(!(user || user.avatar.public_id)){
      throw new ApiError(400,"No old avatar found to delete")
    }

    await deleteOnCloudinary(user.avatar.public_id)
    user.avatar.url=null,
    user.avatar.public_id=null
    user.save({validateBeforeSave :false})

    
    const avatarLocalPath =req.file?.path 
    // server side upload and give path for cloudinary to upload from

    if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is missing")
    }


    const uploadOnCloud = await uploadOnCloudinary(avatarLocalPath)

    if(!uploadOnCloud){
      throw new ApiError(400,"Updated Avatr image is not uploaded on cloudinary")
    }

    const userUpload = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set:{
          avatar:{ 
            url: uploadOnCloud?.url,
            public_id : uploadOnCloud?.public_id
          }
        }
      },{
        new:true
      }
    )

    userUpload.save({validateBeforeSave:false})

    return res.status(200).json(
      new ApiResponse(201,{
        avatar:userUpload.avatar
      })
    )

  } catch (error) {
    new ApiError(400,"Couldn't update Avatr Info")
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

const updateCoverInfo =async(req,res)=>{
  try {
    
  
    const user =await User.findById(req.user?._id)

    if(!(user || user.avatar.public_id)){
      throw new ApiError(400,"No old avatar found to delete")
    }

    await deleteOnCloudinary(user.avatar.public_id)
    user.avatar.url=null,
    user.avatar.public_id=null
    user.save({validateBeforeSave :false})
    

    const coverLocalPath =req.file?.path 
    // server side upload and give path for cloudinary to upload from

    if(!coverLocalPath){
      throw new ApiError(400,"Cover file is missing")
    }

    const uploadOnCloud = await uploadOnCloudinary(coverLocalPath)

    if(!uploadOnCloud){
      throw new ApiError(400,"Updated Cover image is not uploaded on cloudinary")
    }

    const userUpload = await User.findByIdAndUpdate(
      req.user?._id,
      {
        coverImage:{ 
            url: uploadOnCloud?.url,
            public_id : uploadOnCloud?.public_id
          }
      },{new:true}
    )

    userUpload.save({validateBeforeSave:false})

    return res.status(200).json(
      new ApiResponse(201,{
        coverImage:userUpload.coverImage
      })
    )

  } catch (error) {
    new ApiError(400,"Couldn't update Cover Image Info")
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////


const getUserChanelProfile = async(req,res)=>{
  const {userName} = req.params // takes request from url that is params

  if(!userName.trim()){
    throw new ApiError(400,"UserName is empty")
  }

  const chanel = await User.aggregate([
    {
      $match:{
        userName:userName?.toLowerCase()
      },
    },
    {
      $lookup:{
        from: "subscriptions",
        localField: "_id",
        foreignField: "Channel",
        as : "Subscribers" // this become a field
      }
    },
    {
      $lookup:{
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscribe",
        as : "subscriberTO"
      }
    },
    {
      $addFields:{

        subscribersCount:{
          $size: "$Subscribers" 
        },

        chanelSubcribedTo:{
          $size:"$subscriberTO"
        },

        isSubscribed:{
          $cond:{
            if :{$in:[req.user?._id , "$Subscribers.subscriber"]},
            then:true,
            else:false
          }
        }
      }
    },
    {
      $project:{
        userName:1,
        email:1,
        avatar:1,
        coverImage:1,
        subscribersCount:1,
        chanelSubcribedTo:1,
        isSubscribed:1
      }
    }
  ])

  console.log(chanel);
  
  // aggregate returns values in array

if(!chanel.length){
  throw new ApiError(400,"chanel doesn't exist")
}

/*
The length of the array returned by aggregation depends on how many users matched
the $match stage, not how many fields you projected.
    You projected 5 fields (fullName, username, etc.),
    But that doesn’t affect the array length (that’s count of documents, not fields).

So:

  If 1 user matches → channel.length === 1
  If no user matches → channel.length === 0
  If multiple users match (rare here) → channel.length > 1
*/

  return res.status(200)
  .json(
    new ApiResponse(200,chanel[0],"User chanel fetched successfully")
  )
  
}

const getWatchHistory = async(req,res)=>{
  const user = await User.aggregate([
    {
      $match:{
        _id: new mongoose.Types.ObjectId(req.user?._id)
      }
    },
    {
      $lookup:{
        from:"videos",
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHostory",
        pipeline:[
          {
            $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                {
                  $project:{
                    userName:1,
                    avatar:1,
                  }
                },
                {
                  $addFields:{
                    owner:{
                      $first:"$owner" // aggrate pipeline gives result in array. so that why i added
                      // addFields to make it into one object.
                    }
                  }
                }

              ]
              
            },
            
          }
        ]
      }
    }
  ])

  return res.status(200).json(
    new ApiResponse(
      201,
      user[0].watchHistory,
      "Watch history fetched successfully"
    )
  )
}

export{ registerUser, loginUser, logOutUser, refreshAccessToken, passwordUpdate, getCurrnetUser,
  updateUserInfo, updateAvtarInfo, updateCoverInfo, getUserChanelProfile, getWatchHistory}