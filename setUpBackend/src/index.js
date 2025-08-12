import './config/env.js' // this runs dotenv.config() exactly once
import { connectDB } from "./db/index.js";
import { app } from "./app.js";


const Port =process.env.PORT || 3000;


connectDB().then(
  app.listen(Port,()=>{
    console.log("Server is on");
    
  })
)
.catch((error)=>{
  console.log(`Application couldn't be able to run ${error.message}`);
  
})


   
/*

// MongoDb connection in main file.


//  ()() // we will use IFFE to execute it immedately


//  start the server only after a successful MongoDB connection.

(async()=>{ // make this asynchronous. 
  try{
    await mongoose.connect(`${process.env.MONGODB_URL}/${DbName}`)  // wait until promise is resolved. 
    
    const server=app.listen(`${Port}`,()=>{
      console.log(`Server is on at http://localhost:${Port}`);  
      ////////////// I am trying to start the server only if the MongoDB connection is successful.
    })

    server.on("error",(error)=>{
      console.error("Server error",error);
      
    })

  }
  catch(error){
    console.log("There is an error in connecting to mongoDB");
    throw error;
    // process.exit(1);

  immediately stops the Node.js process.
  The number inside exit(...) is called the exit code:
  0 = success (normal exit)
  1 = failure (something went wrong)
*/



/*                                throw error
// It throws an exception (i.e., stops code execution) and passes the error up the call stack.
// If not caught, it crashes the application (in Node.js, it will exit the process with an error).


  }
})()


*/