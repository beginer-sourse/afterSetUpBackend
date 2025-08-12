// import { asyncHandler } from "../utils/asyncHandler";
// import express from "express"

const registerUser=async(req,res)=>{
  try{
  res.status(201).json({message:"ok"})
  }
  catch(error){
    next(error);
  }
} // in this i added try and catch and async but that not necessarly needed.

// Not necessarily — a controller only needs to be async and try and catch if it’s doing 
// something asynchronous, like:
// Reading/writing from a database
// Calling an API
// Writing to a file
// Doing a setTimeout/Promise-based operation

export{registerUser}