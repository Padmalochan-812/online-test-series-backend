import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Test } from "../models/test.model.js"
import { Test_Series } from "../models/test_series.model.js";
import {Subject, subject} from "../models/subject.model.js"

const addSubject  = asyncHandler(async(req, res) => {
    const {testId} = req.params;
    const { name } = req.body
    const test = await Test.findById(testId)

    if(!name){
        throw new apiError (404, "All fields are required!")
    }

    if(!test ){
        throw new apiError (404, "test dose nor exist")
    }
    
    const subject = await Subject.create(
        {
            name,
            test:  testId
        }
    )
    if(!subject){
        throw new apiError(404, "subject not created!")
    }
    return res
    .status(200)
    .json(new apiResponse(200, subject, "subject added successfully."))
})

const updateSubject= asyncHandler(async(req, res) => {
    const {name}= req.body;
    const {testId} = req.params;

    const test = await findById({
        testId,
        {
            $set:{
                title,
                duration,
                totalMarks,
                totalTime,
                startTime,
                endTime
            }
        },
        {
            returnDocument: "after"
        }
    )

    if(!updatedTest){
        throw new apiError(401, "test not update ")
    }

    return res.status(200).json(
        new apiResponse(200, updatedTest, "test series Details update successful")
    )
})

    })
})
