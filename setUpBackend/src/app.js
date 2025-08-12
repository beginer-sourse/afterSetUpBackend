import express from "express"
import cors from"cors"
import cookieParser from "cookie-parser"

const app=express();

// app.use(cors()); // this allows all cors access. meaning everyone can access this app.
// // not recommend


app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))
/*
The credentials: true option in CORS allows cookies, authorization headers, or TLS client
certificates to be included in cross-origin requests.

If your frontend and backend are on different origins and you want to:
Send cookies (like session cookies)
Send Authorization headers (like JWT tokens in headers)
Maintain user sessions between frontend and backend
...then you must set credentials: true.

*/

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"})) 
app.use(express.static("public")) // files and folder stored in public folder
app.use(cookieParser()) // server set and access cookie of client browser


/*
{
  Parsing means:
  "Taking raw data (like a string) and converting it into a structured 
  format (like an object) that your code can understand and use."

  // It parses incoming JSON requests and puts the parsed data in req.body.

  Setting a size limit protects your server from:
  Denial-of-service (DoS) attacks using large payloads.
  Unexpected crashes or memory issues if someone sends a huge request.



  It parses incoming requests with URL-encoded payloads — usually sent 
  via HTML form submissions — and puts the parsed data in req.body
  ex- username=admin&password=1234
    req.body = {
      username: "admin",
      password: "1234"
    }
      extended: false: Only parses simple key-value pairs.

      extended:true    // Allows nested objects and more complex data.
      ex- user[name]=John&user[age]=25
    req.body = {
      user: {
        name: "John",
        age: "25"
      }
    }
}
*/



// import Routes
import UserRouter from "./routes/user.route.js";


// Routes Declaration

app.use("/api/v1/users",UserRouter)



export{app};