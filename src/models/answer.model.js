import mongoose, {Schema} from "mongoose";

const answerSchema = new Schema(
    {
    },
    {
        timestamps: true
    }
)

export const Answer = mongoose.model("Answer", answerSchema)