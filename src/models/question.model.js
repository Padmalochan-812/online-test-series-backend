import mongoose, {Schema} from "mongoose";

const questionSchema = new Schema(
    {
    },
    {
        timestamps: true
    }
)

export const Question = mongoose.model("Question", questionSchema)