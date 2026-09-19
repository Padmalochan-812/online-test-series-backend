import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Question } from "../models/question.model.js";
import {Subject} from "../models/subject.model.js"

const createQuestion = asyncHandler( async(req, res) => {
    const { questionText, mark, negative} = req.body
    if (!questionText || !mark || !negative ) {
        throw new apiError (400, "all fields are required")
    }

    const imageLocalPath = req.file?.path
    const image = await uploadOnCloudinary(imageLocalPath || "");

    
})

export {
    createQuestion
}