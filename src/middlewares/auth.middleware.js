import { APIError } from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import { APIResponse } from "../utils/APIResponse.js";


export const verifyJwt = asyncHandler( async (req, res, next) => {
    try {
        console.log("req.cookies"   , req.cookies);
        
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        console.log("token ", token);
        
        if (!token || typeof token !== "string") {
            throw new APIError(401, "Unauthorized request");
        }
    
        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedInfo?._id).select('-password -refreshToken')

        if(!user) {
            throw APIError(404, 'invalid Access Token')
        }

        req.user = user;
        next();
    } catch (error) {
        throw new APIError(401, error?.message || 'Invalid access token')
    }
})