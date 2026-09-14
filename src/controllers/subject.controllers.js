import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Test } from "../models/test.model.js"
import { Test_Series } from "../models/test_series.model.js";
import {subject} from "../models/subject.model.js"

const addSubject  = asyncHandler(async(req, res) => {
    const {testId} = req.params;
    const { name } = req.body
    const test = await Test.findById(testId)

    if(!test ){
        throw new apiError (404, "test dose nor exist")
    }

    
})

