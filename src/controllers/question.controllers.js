import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Question } from "../models/question.model.js";
import {Test} from "../models/test.model.js"
import {Subject} from "../models/subject.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const createQuestion = asyncHandler(async (req, res) => {

    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId);

    if (!subject) {
        throw new apiError(400, "Subject is required");
    }

    const {
        questionText,
        options,
        marks,
        negativeMarks
    } = req.body;

    // Required fields
    if (
        !questionText ||
        marks === undefined ||
        negativeMarks === undefined ||
        !options
    ) {
        throw new apiError(400, "All fields are required");
    }

    // Convert options string to array
    let parsedOptions;

    try {
        parsedOptions = JSON.parse(options);
    } catch (error) {
        throw new apiError(400, "Invalid options JSON");
    }

    // Validate options
    if (!Array.isArray(parsedOptions)) {
        throw new apiError(400, "Options are required");
    }

    if (parsedOptions.length < 2) {
        throw new apiError(
            400,
            "At least 2 options are required"
        );
    }

    // Check correct answer
    const correctOptions = parsedOptions.filter(
        (option) => option.isCorrect === true
    );

    if (correctOptions.length === 0) {
        throw new apiError(
            400,
            "One or more correct answers are required"
        );
    }

    // Upload image if provided
    const questionLocalPath = req.file?.path;

    const image = questionLocalPath
        ? await uploadOnCloudinary(questionLocalPath)
        : null;

    // Create question
    const question = await Question.create({
        subject: subjectId,
        questionText,
        questionImage: image?.url || "",
        options: parsedOptions,
        marks,
        negativeMarks
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

const updateQuestion = asyncHandler(async (req, res) => {

    const { questionId } = req.params;

    const {
        questionText,
        questionImage,
        options,
        marks,
        negativeMarks,
    } = req.body;

    if (!questionId) {
        throw new apiError(400, "Question ID is required");
    }

    // Check question exists
    const existingQuestion = await Question.findById(questionId);

    if (!existingQuestion) {
        throw new apiError(404, "Question not found");
    }

    // If options are being updated, validate them
    if (options !== undefined) {

        if (!Array.isArray(options)) {
            throw new apiError(400, "Options must be an array");
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

        if (correctOptions.length <1 ) {
            throw new apiError(
                400,
                "at least one correct answer is required"
            );
        }
    }

    // Don't allow an empty question
    if (
        questionText !== undefined &&
        !questionText.trim() &&
        !questionImage &&
        !existingQuestion.questionImage
    ) {
        throw new apiError(
            400,
            "Question text or question image is required"
        );
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        {
            $set: {
                ...(questionText !== undefined && {
                    questionText: questionText.trim(),
                }),

                ...(questionImage !== undefined && {
                    questionImage,
                }),

                ...(options !== undefined && {
                    options,
                }),

                ...(marks !== undefined && {
                    marks,
                }),

                ...(negativeMarks !== undefined && {
                    negativeMarks,
                }),
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    return res.status(200).json(
        new apiResponse(
            200,
            updatedQuestion,
            "Question updated successfully"
        )
    );
});

const deleteQuestion = asyncHandler(async (req, res) => {

    const { questionId } = req.params;

    if (!questionId) {
        throw new apiError(400, "Question ID is required");
    }

    const question = await Question.findById(questionId);

    if (!question) {
        throw new apiError(404, "Question not found");
    }

    await Question.findByIdAndDelete(questionId);

    return res.status(200).json(
        new apiResponse(
            200,
            {},
            "Question deleted successfully"
        )
    );
});




export {
    createQuestion,
    getQuestionsBySubject,
    updateQuestion,
    deleteQuestion
};
