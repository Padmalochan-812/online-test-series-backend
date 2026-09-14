import mongoose, {Schema} from "mongoose";

const subjectSchema = new Schema(
    {
        name:{
            type:String,
            required: true
        },
        test:{
            type: Schema.Types.ObjectId,
            ref: "Test"
        }

    },
    {
        timestamps: true
    }
)

export const Subject = mongoose.model("Subject", subjectSchema)