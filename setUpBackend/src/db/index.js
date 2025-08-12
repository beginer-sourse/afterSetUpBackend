import mongoose from "mongoose";
import {DbName} from "../constants.js"

const connectDB=async ()=>{
  try{
  const connectionInst= await mongoose.connect(`${process.env.MONGODB_URL}/${DbName}`)
  // mongoose return object.
  // this will contant responce 
  console.log(`Connection is stablised ${connectionInst.connection.host}`);
  }
  catch(error){
    console.log("Couldn't connect to mongoDB",error);
    process.exit(1);
    
  }
}

export {connectDB};