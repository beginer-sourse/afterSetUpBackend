// authication middleware

import { User } from "../models/User.model.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

// The token you send in the response (inside cookies) during login is the same token that the client 
// will use later when making authenticated requests.

const verifyJWT= async function(req,_,next){ // _ wrote this beacuse res is not in use
  try{

    // Get token from cookies or header 

    // if request have cookies not empty.
    const Acc_token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") 

    /*
    The raw header looks like:
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

    But we only need the token part (eyJhbGciOi...)
    So .replace("Bearer ", "") removes the "Bearer " prefix, leaving just the token string.
    */



    if(!Acc_token){
      throw new ApiError(401,"Access Token is empty")
    }

    // verify Token
    const decodeToken= jwt.verify(Acc_token,process.env.ACCESS_TOKEN_SECRET)

    
    if(!decodeToken){
      throw new ApiError(401,"Unauthorized request")
    }

    const user = await User.findById(decodeToken._id).select("-password -refreshToken")

    if(!user){
      throw new ApiError(401,"Invalid Access token")
    }

    req.user=user // gives user's  whole mongoose document
    next() // for next middleware

  }
  catch(error){
    throw new ApiError(400, error?.message || "Jwt token couldn't be verifed")
  }
}

export{verifyJWT}