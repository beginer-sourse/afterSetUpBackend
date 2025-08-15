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
    
    // process.exit(1);

// process.exit(1) stops the server immediately.

// Exit code 1 tells the OS (or deployment service like
//  Docker, PM2, Kubernetes) that the app crashed so it can restart or alert.

  // immediately stops the Node.js process.
  // The number inside exit(...) is called the exit code:
  // 0 = success (normal exit)
  // 1 = failure (something went wrong)

  }
}

export {connectDB};