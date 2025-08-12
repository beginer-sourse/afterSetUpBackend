import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'

const userSchema=new mongoose.Schema(
  {
    username:{
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
      type:true,  // cloudinary url
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
  return await bcrypt.compare(password,this.password) // return value is boolea
} 


userSchema.methods.AcessTokenGen=function(){ 
  // create token

  // jwt token genrate
  let Acc_token=jwt.sign( // playload
    {
      _id:this._id,
      username:this.username,
      email:this.email
    },

    process.env.ACCESS_TOEKN_SECRET,
    
    {
      expiresIn:process.env.ACCESS_TOEKN_EXP
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
      expiresIn:process.env.REFRESH_TOEKN_EXP
    }
  )

  return Ref_token;
}



export const User=mongoose.model("User",userSchema)