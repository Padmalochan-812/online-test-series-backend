import mongoose, {Schema} from "mongoose";

const subjectSchema = new Schema(
    {
    },
    {
        timestamps: true
    }
)

export const Subject = mongoose.model("Subject", subjectSchema)