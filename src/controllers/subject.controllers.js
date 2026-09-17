import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Test } from "../models/test.model.js"
import { Test_Series } from "../models/test_series.model.js";
import {Subject} from "../models/subject.model.js"

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
    const {subjectId} = req.params;

    const subject = await findById(
        subjectId,
        {
            $set:{
                name
            }
        },
        {
            returnDocument: "after"
        }
    );

    if(!subject){
        throw new apiError(401, "subject not update ")
    }

    return res.status(200).json(
        new apiResponse(200, updateSubject, "subject Details update successful")
    )
})

const getAllSubject = asyncHandler( async(req, res) => {
    const {testId} = req.params

    const subject = await Subject.find({
        test : testId
    })

    if(subject.length === 0){
        throw new apiError(404, "there was no subjects" )
    }
    
    return res.status(200).json(
        new apiResponse(
            200,
            subject,
            "All subjects fetched successfully"
        )
    );
})

const getSubjectById = asyncHandler(async(req, res) => {
    const {subId} = req.params ;

    const subject = await Subject.findById(subId)
    if(!subject){
        throw new apiError(404,"Subject not exist")
    }

    return res.status(200).json(
        new apiResponse(
            200,
            subject,
            "all subjects fetched successfully"
        )
    );

})


const deleteSubject = asyncHandler(async (req, res) => {
    const {subjectId} = req.params;
    const subject = await Subject.findById(subjectId)
    if(!subject){
        throw new apiError(401, "Subject not found..")
    }

    await Subject.findByIdAndDelete(subjectId);

    return res
    .status(200)
    .json(new apiResponse(200, "", "test deleted successfully"))
})

export {
    addSubject,
    updateSubject,
    getAllSubject,
    getSubjectById,
    deleteSubject
}
