import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Test } from "../models/test.model.js"
import { Test_Series } from "../models/test_series.model.js";


const createTest = asyncHandler( async (req, res)=> {
    const {title, duration, totalMarks, totalTime, startTime, endTime } = req.body;

    if (!title || !duration || !totalMarks || !totalTime || !startTime || !endTime) {
        throw new apiError(400, "All fields are required!");
    }

    const {id} = req.params
    
    const test_series = await Test_Series.findById(id)
    if(!test_series) {
        throw new apiError(404, "test series not found" )
    };

    const test = await Test.create({
        title,
        duration,
        totalMarks,
        totalTime,
        startTime,
        endTime,
        testSeries: id
    })

    if(!test) {
        throw new apiError(404, "Something went wrong while creating test !")
    }
    
    return res.status(201).json(
        new apiResponse(
            201,
            test,
            "Test created successfully"
        )
    );
})

const updateTest = asyncHandler( async(req, res) => {
    const {testId} = req.params;

    

    const {title, duration, totalMarks, totalTime, startTime, endTime } = req.body;

    if (!title || !duration || !totalMarks || !totalTime || !startTime || !endTime) {
        throw new apiError(400, "All fields are required!");
    }

    const test = await Test.findById(testId);
    if(!test) {
        throw new apiError(404, "Test not found!")
    }

    const updatedTest = await Test.findByIdAndUpdate(
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


const getAllTest = asyncHandler(async (req, res) => {

    const { testSeriesId } = req.params;

    const tests = await Test.find({
        testSeries: testSeriesId
    });

    if (tests.length === 0) {
        throw new apiError(404, "No tests found in this test series");
    }

    return res.status(200).json(
        new apiResponse(
            200,
            tests,
            "All tests fetched successfully"
        )
    );
});



export {
    createTest,
    updateTest,
    getAllTest
}