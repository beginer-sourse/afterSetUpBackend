import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema(
  {
    userName:{
      type:String,
      required:true,
      unique:true,
      lowercase:true,
      trim:true,
      index:true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true, 
    },
    fullName: {
      type: String,
      required: true,
      trim: true, 
      index: true
    },
    avatar:{
      type:String,  // cloudinary url
      required:true
    },
    coverImage:{
      type:String // cloudinary url
    },
    watchHistory:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Video"

    }
    ],

    /*

      MongoDB will only store the ObjectId (e.g., "64f1...c83") in the subscriber field.
      It does not store the whole User document.

      The ref tells Mongoose:
      "This ObjectId refers to a document in the users collection (model name "User")."


      Export vs Model Name

        export const User = mongoose.model("User", userSchema)
        → User is just your JavaScript variable name.

        "User" (first argument in mongoose.model) is the model name Mongoose uses internally.
        Mongoose will also automatically map that to a MongoDB collection:
        
        Model "User" → Collection "users" (lowercase + plural).
        So you must use "User" in ref.
    */
   
    password:{
      type:String,
      required:[true, "Password is Required"]
    },
    refreshToken:{
      type:String
    }

  },
{timestamps:true})


userSchema.pre("save", async function(next){
  if(!this.isModified("password")) { return next();}

  this.password=await bcrypt.hash(this.password,10); // salt round is 10
  next(); // 
})

userSchema.methods.isPasswordSame=async function(password){
  return await bcrypt.compare(password,this.password) // return value is boolean
} 


userSchema.methods.AcessTokenGen=function(){ 
  // create token

  // jwt token genrate
  let Acc_token=jwt.sign( // playload
    {
      _id:this._id,
      username:this.userName,
      email:this.email
    },

    process.env.ACCESS_TOKEN_SECRET,
    
    {
      expiresIn:process.env.ACCESS_TOKEN_EXP
    }
  )

  return Acc_token;
}


userSchema.methods.RefreshTokenGen=function(){ 
  
  let Ref_token=jwt.sign( 
    {
      _id:this._id,
    },

    process.env.REFRESH_TOKEN_SECRET,
    
    {
      expiresIn:process.env.REFRESH_TOKEN_EXP
    }
  )

  return Ref_token;
}



export const User=mongoose.model("User",userSchema)