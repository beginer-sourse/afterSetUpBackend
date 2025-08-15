# BackEnd Setup

-[Model Link](https://app.eraser.io/workspace/LG1ut6DdwqHkSSxlzP1Q)

-[Chai Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj) 

-[chai backend repo](https://github.com/hiteshchoudhary/chai-backend)




In package.json file type change to module.js
// nodemon is package used to restart server when you file is saved. so you don't have start and 
stop you server again and again. when there are changes in them.

Difference between dependency and dev dependency in nodemon
dev dependency useed in development. so i don't send in production files. but not same with 
original dependency.

when you try to push push folder that is empty git doesn't take. you have fill the folder with file first. then it will allow.

    // process.exit(1);

  immediately stops the Node.js process.
  The number inside exit(...) is called the exit code:
  0 = success (normal exit)
  1 = failure (something went wrong)
*/



/*                                throw error
// It throws an exception (i.e., stops code execution) and passes the error up the call stack.
// If not caught, it crashes the application (in Node.js, it will exit the process with an error).



//                                  .env

If you change anything in .env(environment variable) then you have to retart the server again
nodemon doen't work if there is change in .env

The .env file is loaded into process.env by calling require('dotenv').config() (or import 'dotenv/config' if you're using ES modules).
Once it's loaded once, process.env becomes available globally throughout your Node.js app — in any file.

This does 2 things:
Reads the .env file.
Populates the values into Node.js's global process.env object.

process is a global object in Node.js — available in every file, without importing it.

  But important note:
You must ensure dotenv.config() is called before you try to access any process.env variables.
If your main file accesses process.env before loading the file where you called dotenv.config(), it will be undefined.

  /*
  You need to import the file that runs dotenv.config() to actually load the .env variables into
  process.env.

  Once loaded, process.env is indeed globally available, but dotenv.config() is not run 
  automatically unless you explicitly import the file where it's called.
  */



//                                  middleWares

middleware are functionality that used in between req and res of data.
ex- /insta   -- req   --middleware  (is user login)     -- res res.json()

app.use in middlewares. 
ex-  there are 4 paramters next is used if one middleware is checked then it jumps to after another 
middleware.

app.get('/',(err,req,res,next)=>{
  res.send("Server is On");
})


//                                MongoDb

It automatically creates a unique _id field (usually an ObjectId) for each document unless provided.
MongoDB stores data in BSON (Binary JSON) format internally, not plain JSON.
You can still work with JSON in your app; MongoDB will handle the BSON part behind the scenes.

The schema defines the structure, like a blueprint.
The document is an actual record stored in the database


//////////////////////////////////////////////////////

//                                        Hashing

Hashing is a process of taking some input data (like a password) and running it through a mathematical function (called a hash function) to produce a fixed-size output called a hash.

One-way process
You can generate a hash from the original data, but you cannot reverse it to get the original data back.

Fixed size output
No matter the size of the input, the hash output length is always fixed.

Deterministic
The same input will always produce the same hash.


  //                                          bcrypt

  Nope — you cannot reverse a bcrypt-hashed password.

bcrypt is a hashing algorithm designed for securely storing passwords.

Why bcrypt instead of simple hashing (like MD5, SHA256)?
Salted → bcrypt automatically generates a random salt for each password before hashing. This means even if two users have the same password, their hashes will be different.

    How bcrypt works under the hood
Generate a salt → A random string mixed into the password before hashing.
Hash with cost factor → Repeats the hashing process many times (2^costFactor rounds).
Store salt + hash together → bcrypt output contains both the salt and the hash in one string.




//  JWT (JSON Web Token)  Base64URL encoding

Authentication (main purpose)
  When a user logs in, we give them a token.
  They send this token with every request to prove their identity.
Stateless (no need to store session in server memory)
  The server doesn’t store who’s logged in — the token itself carries that info.
Secure (if secret key is safe)
  Tokens can be signed so they can’t be tampered with.


It's a string that contains:
Header (type & algo)
Payload (user data)
Signature (for verification) a hash created using your secret key


Why we need refresh tokens

  Access tokens (JWTs) usually expire quickly (e.g., 15 min – 1 hr) for security.
  If the token expires, the user would have to log in again — annoying.
  Refresh tokens are valid for a much longer time (e.g., days, weeks, months).
  They let the user request a new access token without re-entering username & password.



//                              Postman
In body of Postman in form section we use files but not in x-www-form-urlencoded.