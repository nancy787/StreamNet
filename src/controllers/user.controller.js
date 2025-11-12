import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloundinary} from "../utils/cloudinary.js";
import { APIResponse } from "../utils/APIResponse.js";

const registerUser = asyncHandler( async (req, res) => {
   console.log("BODY =>", req.body);
console.log("FILES =>", req.files);

   const {name, fullName, email, username, password} = req.body
   console.log(req.body);
   
   if( [ name, fullName, email, username, password ].some( (field)  =>  
      field?.trim() === " ") 
      ) 
      {
         throw new APIError(400, 'All fileds are required')
      }

      const existedUser =await User.findOne( {
         $or : [ {username} , {email}]
      });

      if(existedUser) {
         throw new APIError(400, 'username or email already exists')
      }
      console.log(req.files);
      
      const avatarLocalPath = req.files?.avatar[0]?.path;
      // const coverImagelocalPath = req.files?.coverImage[0]?.path;

      let coverImagelocalPath
      if(req.files && Array.isArray( req.files.coverImage) && req.files.coverImage.length > 0 ){
         coverImagelocalPath = req.files.coverImage[0].path;
      }
      if(!avatarLocalPath) {
         throw new APIError(400, 'avatar image is not found')
      }
      console.log("req");


      const avatarImg    =  await uploadOnCloundinary(avatarLocalPath)
      const coverImg     = await uploadOnCloundinary(coverImagelocalPath)
      
      if(!avatarImg) {
         throw new APIError(400, 'image not added on serev')
      }

      const user = await User.create( {
         name,
         fullName, 
         avatar : avatarImg.url,
         coverImage : coverImg?.url || '',
         email,
         password,
         username: username.toLowerCase()
         })

         console.log(user);
         const getUser = await User.findById(user._id).select(
            "-password -refreshToken", 
         )

         console.log(getUser);

         if(!getUser) {
            throw new APIError(500, 'someting went wrg while registering the user')
         }
         
         return res.status(201).json(
            new APIResponse(200, getUser, 'user registerd successfully')
         )

});

export {registerUser,}

