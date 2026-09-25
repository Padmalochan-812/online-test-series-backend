import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Question } from "../models/question.model.js";
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

const getQuestionsById = asyncHandler(
    async (req, res) => {

        const { questionId } = req.params;

        if (!questionId) {
            throw new apiError(
                400,
                "Question ID is required"
            );
        }

        const question = await Question.findById({
            questionId
        }).select("-options.isCorrect");

        if (question.length === 0) {
            throw new apiError(
                404,
                "No questions found "
            );
        }

        return res.status(200).json(
            new apiResponse(
                200,
                question,
                "Questions fetched successfully"
            )
        );
    }
);
const updateQuestion = asyncHandler(async (req, res) => {

    const { questionId } = req.params;

    if (!questionId) {
        throw new apiError(400, "Question ID is required");
    }

    // Check question exists
    const existingQuestion = await Question.findById(questionId);

    if (!existingQuestion) {
        throw new apiError(404, "Question not found");
    }

    const {
        questionText,
        options,
        marks,
        negativeMarks
    } = req.body;

    // -----------------------------
    // Parse options
    // -----------------------------

    let parsedOptions;

    if (options !== undefined) {
        try {
            parsedOptions = JSON.parse(options);
        } catch (error) {
            throw new apiError(400, "Invalid options JSON");
        }

        if (!Array.isArray(parsedOptions)) {
            throw new apiError(400, "Options must be an array");
        }

        if (parsedOptions.length < 2) {
            throw new apiError(
                400,
                "At least 2 options are required"
            );
        }

        const correctOptions = parsedOptions.filter(
            (option) => option.isCorrect === true
        );

        if (correctOptions.length < 1) {
            throw new apiError(
                400,
                "At least one correct answer is required"
            );
        }
    }

    // -----------------------------
    // Question image
    // -----------------------------

    let questionImage = existingQuestion.questionImage;

    if (req.file?.path) {

        const image = await uploadOnCloudinary(req.file.path);

        if (!image?.url) {
            throw new apiError(
                500,
                "Failed to upload question image"
            );
        }

        questionImage = image.url;
    }

    // -----------------------------
    // Validate question text/image
    // -----------------------------

    const finalQuestionText =
        questionText !== undefined
            ? questionText.trim()
            : existingQuestion.questionText;

    if (!finalQuestionText && !questionImage) {
        throw new apiError(
            400,
            "Question text or question image is required"
        );
    }

    // -----------------------------
    // Update question
    // -----------------------------

    const updateData = {};

    if (questionText !== undefined) {
        updateData.questionText = questionText.trim();
    }

    if (parsedOptions !== undefined) {
        updateData.options = parsedOptions;
    }

    if (marks !== undefined) {
        updateData.marks = marks;
    }

    if (negativeMarks !== undefined) {
        updateData.negativeMarks = negativeMarks;
    }

    if (req.file?.path) {
        updateData.questionImage = questionImage;
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        {
            $set: updateData
        },
        {
            new: true,
            runValidators: true
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
    deleteQuestion,
    getQuestionsById
};
