import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { use } from "react";

const userSchema  = new Schema(
{
    name : {
        type : String, 
        required : [true, 'name is required'],
        unique : [true, 'must be unique'],
        lowercase : true,
        trim : true,
        index : true //for optimise
    },
    email  : {
        type : String,
        required : [true, 'email is required'], 
        unique : true,
        lowercase : true,
        trim : true,
    },
    fullName : {
        type : String, 
        required : [true, 'fullname is required'],
        lowercase : true,
        trim : true,
        index : true,
    },
    avatar : {
        type : String, //cloudnaryUrl,
        required : [true, 'profile image is required'],
    },
    coverImage : {
        type : String,
    },
    watchHistory: [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String,
        required : [true, 'Password is required'],
    },
    refershToken : {
        type : String,
    }

}, {
    timestamps : true
})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return  next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})
//to define custom method
userSchema.methods.isPasswordCorrect = async  function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return  jwt.sign(
        {
            _id      : this._id,
            email    : this.email,
            username : this.fullName,
            fullName : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return  jwt.sign(
        {
            _id      : this._id,
        },
        process.env.REFERSH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFERSH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User',  userSchema)