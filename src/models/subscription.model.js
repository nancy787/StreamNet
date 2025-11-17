import mongoose, { Schema } from "mongoose";


const SubscriptionSchema = new Schema({
    subscriber : {
        type : Schema.Types.ObjectId, //user who is subsrciobeing
        ref : "User"
    }, 
    channel : {
        type : Schema.Types.ObjectId, //one
        ref : "User"
    }
 }, {timestamps : true})


export const Subscription = mongoose.model( 'Subscription', SubscriptionSchema)