// models/question.model.js

import mongoose, { Schema } from "mongoose";

const optionSchema = new Schema(
    {
        text: {
            type: String,
            default: "",
            trim: true,
        },

        image: {
            type: String,
            default: "",
        },

        isCorrect: {
            type: Boolean,
            default: false,
        },
    },
    {
        _id: true,
    }
);

const questionSchema = new Schema(
    {
        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true,
        },

        questionText: {
            type: String,
            default: "",
            trim: true,
        },

        questionImage: {
            type: String,
            default: "",
        },

        options: {
            type: [optionSchema],
            required: true,
        },

        marks: {
            type: Number,
            default: 1,
        },

        negativeMarks: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const Question = mongoose.model(
    "Question",
    questionSchema
);