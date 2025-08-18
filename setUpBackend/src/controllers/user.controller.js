// import { asyncHandler } from "../utils/asyncHandler";
// import express from "express"


import { uploadOnCloudinary } from "../config/cloudinary.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";


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

////////////////////////////////////////////////////////////////////////////////////

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
  
      if (!userName && !email) {
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
            $set:{
              refreshToken:undefined
            },
          },
          {
            new :true
          }
      )

      const options={
        httpOnly:true,
        secure:true
      }

      return res.status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(200,{},"User logOut")


      /*

      const userId= req.user?._id // comes from auth middleware

      if(!userId){
        throw new ApiError(401,"User Id is empty")
      }

      const user = await User.findById(userId);

      if(!user){
        throw new ApiError(401,"User not found in DB")
      }
      
      user.refreshToken="" // clear refresh token so no access token genrate
      await user.save({ validateBeforeSave: false })


      // clear cookies both access and refresh token 

      cont options ={
        httpOnly:true,
        secure:true
      }

      res.status(200)
      .clearCookie("AccessToken",options)
      .clearCookie("RefreshToken",options).
      json(200,{},"User logOut")

     */ 

    } catch (error) {
      throw new ApiError(401,"User is not able to logOut")
    }
}

export{registerUser,loginUser,logOutUser}