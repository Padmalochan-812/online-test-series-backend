import mongoose, {Schema} from "mongoose";

const testQuestionSchema = new Schema(
    {
    },
    {
        timestamps: true
    }
)

export const TestQuestion = mongoose.model("TestQuestion", testQuestionSchema)