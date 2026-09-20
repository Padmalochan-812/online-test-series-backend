import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Question } from "../models/question.model.js";
import {Test} from "../models/test.model.js"
import {Subject} from "../models/subject.model.js"


const createQuestion = asyncHandler(async (req, res) => {

    const {testId} = req.params;

    const {
        subject,
        questionText,
        questionImage,
        options,
        marks,
        negativeMarks,
    } = req.body;

    const test =await Test.findById(testId);

    if (!test) {
        throw new apiError(
            400,
            "test is required"
        );
    }

    if (!subject) {
        throw new apiError(
            400,
            "Subject ID is required"
        );
    }

    if (!questionText && !questionImage) {
        throw new apiError(
            400,
            "Question text or question image is required"
        );
    }

    if (!options || !Array.isArray(options)) {
        throw new apiError(
            400,
            "Options are required"
        );
    }

    if (options.length < 2) {
        throw new apiError(
            400,
            "At least 2 options are required"
        );
    }

    const correctOptions = options.filter(
        (option) => option.isCorrect === true
    );

    if (correctOptions.length !== 1) {
        throw new apiError(
            400,
            "Exactly one correct answer is required"
        );
    }

    const question = await Question.create({
        subject,
        questionText: questionText || "",
        questionImage: questionImage || "",
        options,
        marks: marks || 1,
        negativeMarks: negativeMarks || 0,
    });

    return res.status(201).json(
        new apiResponse(
            201,
            question,
            "Question created successfully"
        )
    );
});


const getQuestionsBySubject = asyncHandler(
    async (req, res) => {

        const { subjectId } = req.params;

        if (!subjectId) {
            throw new apiError(
                400,
                "Subject ID is required"
            );
        }

        const questions = await Question.find({
            subject: subjectId,
        }).select("-options.isCorrect");

        if (questions.length === 0) {
            throw new apiError(
                404,
                "No questions found for this subject"
            );
        }

        return res.status(200).json(
            new apiResponse(
                200,
                questions,
                "Questions fetched successfully"
            )
        );
    }
);


export {
    createQuestion,
    getQuestionsBySubject,
};
