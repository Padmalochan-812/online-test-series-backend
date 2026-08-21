import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {upload} from "../middlewares/multer.middlewares.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return { accessToken, refreshToken}

    } catch (error) {
        console.log(error)
        throw new apiError(500,  "Something went wrong while generating access and refresh token")
    }
}

const registerUSer = asyncHandler( async (req, res) => {
    const {username, fulName, email, password, phone_number} = req.body;
    if(
        [fulName, email, username, password, phone_number].some((field) =>
        field?.trim() === "")
    )  {
        throw new apiError (400, "All fields are required !");
    };

    const existedUser = await User.findOne({
        $or:[{phone_number}, {email}]
    })

    if(existedUser){
        throw new apiError(409, "User with email or number")
    }

    const avatarLocalPath = req.field?.avatar?.[0]?.path;

    if (!avatarLocalPath){
        avatarLocalPath = "";
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        phone_number,
        fulName,
        avatar: avatar?.url || "",
        password
    })

    const createdUser = await User.findById (user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiError(500, "Something went wrong while user registering  ")
    }

    return res.status(201).json(
        new apiResponse(200, createdUser, "User register successfully")
    )
})

