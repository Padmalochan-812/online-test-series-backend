import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"
import {upload} from "../middlewares/multer.middlewares.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import { appendFileSync } from "fs";

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

const registerUser = asyncHandler( async (req, res) => {
    const {username, fulName, email, password, phone_number, role} = req.body;
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

    const avatarLocalPath = req.file?.path;
    
    
    const avatar = await uploadOnCloudinary(avatarLocalPath || "");

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

const loginUser = asyncHandler( async (req, res) => {
    const {phone_number, email, password} = req.body

    if(!phone_number || !email ) {
        throw new apiError(404, "Email or Phone number is required !")
    }

    const user = await User.findOne({
        $or: [{email}, {phone_number}]
    })
    if(!user){
        throw new apiError(404, "User dose not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new apiError(404, "Invalid user credential")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                loggedInUser
            },
            "User login successfully."
        )
    )


})

const logoutUser = asyncHandler (async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
           $unset: {
                refreshToken: 1
           } 
        },
        {
            returnDocument: "after"
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new apiResponse(200, {}, "user logout successfully")
    )
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if(!incomingRefreshToken){
            throw new apiError(401, "Unauthorize request")
        }

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new apiError(404, "Invalid refresh Token")
        }

        if(incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Refresh Token is expire or used ")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)

        return res 
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "Access Token refresh successfully"
            )
        )

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid refresh Token")
    }
})

const ChangeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword , newPassword} = req.body
    const user = await User.findById(req.user._id)
    const isPasswordCorrect  = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect) {
        throw new apiError(401, "Invalid Old Password")
    }

    user.password = newPassword

    await user.save({validateBeforeSave: false})

    return res.status(200).json(
        new apiResponse(200, {}, "Password change successfully")
    )
})

const userProfile = asyncHandler( async (req, res) => {
    const user = req.user
    return res.status(200).json(200, user, "Current user fetched Successfully")
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const {username, fulName } = req.body
    if(!fulName || !username){
        throw new apiError (
            400, "All fields are required "
        )
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                fulName,
                username
            }
            
        },
        {
            returnDocument: "after"
        }
    ).select("-password -refreshToken")

    return res.status(200).json(
        new apiResponse(200, user, "User Details update successful")
    )

})

const updateAvatar = asyncHandler (async (req, res) => {
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new apiError(401, "Avatar local path is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url) {
        throw new apiError(400, "Error while uploading on Avatar ")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        { returnDocument: "after"}
    ).select("-password -refreshToken")

    return res.status(200)
    .json(200, user, "Avatar Image updated successfully")
})





export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    ChangeCurrentPassword,
    userProfile,
    updateUserDetails,
    updateAvatar
}