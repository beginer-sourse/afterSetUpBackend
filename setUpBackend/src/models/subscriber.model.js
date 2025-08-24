import mongoose from "mongoose"

const subscriberSchema = new mongoose.Schema(
  {
    subscribe: {
      type:mongoose.Schema.Types.ObjectId, // people that subscribing
      ref:"User"
    },

    Channel:{
      type:mongoose.Schema.Types.ObjectId, // prople who they are subscribing (single user)
      ref : "User"
    }
  }
,{timestamps:true}
)
/*
  how we know if user chanel is subscribe by how many people.
    we see if the multiple user have that channel in subscription 
    meaning we take chanel as common and count documents that user have that channel has common.

  how we know if a particular user subscribed to how many user's chanel
    we take that paricular user as common and count the documents of multiple user's chanel that has that user as common.
*/

export const Subscription = mongoose.model("Subscription",subscriberSchema)