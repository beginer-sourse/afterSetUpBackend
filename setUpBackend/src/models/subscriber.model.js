import mongoose from "mongoose"

const subscriberSchema = new mongoose.Schema(
  {
    subscriber: {
      type:mongoose.Schema.Types.ObjectId, // people that subscribing
      ref:"User"
    },

    chanel:{
      type:mongoose.Schema.Types.ObjectId, // prople who they are subscribing (single user)
      ref : "User"
    }
  }
,{timestamps:true}
)

export const Subscriber = mongoose.model("Subscriber",subscriberSchema)