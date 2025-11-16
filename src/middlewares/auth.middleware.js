import { APIError } from "../utils/APIError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken"
import {User} from "../controllers/user.controller";

export const verifyJwt = asyncHandler( async (requestAnimationFrame, res, next) => {
    try {
        const token = req.cookies?.accessToken  || req.header("Authorization")?.reolace( "Bearer ", "")
    
        if(!token) {
            throw new APIError(401, 'Unauthorzed request ')
        }
    
        const decodedInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedInfo?._id).select('-password', '-refreshToken')
    
        if(!user) {
            throw APIError(404, 'invalid Access Token')
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new APIError(401, error?.message || 'Invalid access token')
    }
})