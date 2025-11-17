import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloundinary} from "../utils/cloudinary.js";
import { APIResponse } from "../utils/APIResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async(userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;  
      await user.save( {  validateBeforeSave : false})

      return {accessToken, refreshToken}
   } catch (error) {
      throw new APIError('500', 'something went wrong while generating access or refresh tokens')
   }
}

const registerUser = asyncHandler( async (req, res) => {
   // console.log("BODY =>", req.body);
// console.log("FILES =>", req.files);

   const {name, fullName, email, username, password} = req.body
   console.log(req.body);
   
   if( [ name, fullName, email, username, password ].some( (field)  =>  
      field?.trim() === "") 
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

const loginUser = asyncHandler(  async( req , res) =>  {
   // add validation email or username and pasword requd
// take email or username and password
// mathc email or useer name and passwoed with databass
// validate with userame/e,mil or passowd with db
// if not found return no useer found
// if found rerturn repsonse user details and token


   const { username, email, password} = req.body


   // if(!username  || !email) {
   //    throw new APIError(400, 'email or username is required')
   // }

   if(! (username || email)) {
      throw new APIError(400, 'email or username is required')
   }

   if(!password){
      throw new APIError(400, 'password is required')
   }

   const user = await User.findOne(  {
    $or: [
         { username: username },
         { email: email }
      ]
   }).select("+password");

   // const user = await User.findOne({ email }).select("+password");
   if(!user) {
      throw new APIError(404, 'user not fpound')
   }
   
   const isPasswordValid  = await user.isPasswordCorrect(password)

   if(!isPasswordValid) {
      throw new APIError(401, 'Invalid user creadientials')
   }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)


   const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

   // pass cokkiess if you enalme http only and secture then it modifies only from the server
   const options = {
      httpOnly : true,
      secure : false,  //as using http
      sameSite: "lax",
   }

  return res.status(200)
                     .cookie("accessToken", accessToken, options)
                     .cookie("refreshToken", refreshToken, options)
                     .json(
                        new APIResponse(
                           200,
                           {
                           user: loggedInUser,
                           accessToken,
                           refreshToken
                           },
                           "User logged In successfully"
                        )
                     );

});

const logoutUser = asyncHandler( async (req, res) => {
  await User.findByIdAndUpdate(
      req.user._id,
      {
         $set : {refreshToken  : null}
      },
      {
         new : true
      }
   )

   const options = {
      httpOnly : true,
      secure : false,
      sameSite: "lax",
   }

 res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);

  return res.status(200).json(
    new APIResponse(200, null, "User logged out successfully")
  );
})


const refreshAccessToken = asyncHandler( async (req, res) => {
 const incomingRefreshToken =   req.cookie.refreshToken || req.body.refreshToken;
   if(!incomingRefreshToken) {
      throw new APIError(401, 'unauthorised Access')
   }
   try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFERSH_TOKEN_SECRET)
   
      const user = await User.findById(decodedToken?._id)
      if(!user) {
         throw new APIError(401, 'invalid token')
      }
   
      if(incomingRefreshToken !== user.refreshToken) {
         throw new APIError(401, 'Refresh access token is expired or used')
      }
   
      const options = {
         httpOnly : true,
         secure : false,
      }
   
     const {accessToken, newRefreshToken} =   await generateAccessAndRefreshToken(user._id)
   
      return res.status(200).cookie("accessToken", accessToken, options)
                        .cookie("refreshToken", newRefreshToken, options)
                        .json( new APIResponse (
                           200, 
                           {accessToken, newRefreshToken},
                           "Access token refreshed !"
                        ))
   } catch (error) {
      throw new APIError(500, 'invaloid refresh token')
   }

})

export {registerUser, loginUser, logoutUser, refreshAccessToken}