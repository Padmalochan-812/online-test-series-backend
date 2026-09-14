import mongoose, {Schema} from "mongoose";

const questionSchema = new Schema(
    {
        questionText:{
            type: String,
            required: true
        },
        questionImage:{
            type: String,
            
        },
        mark:{
            type: Number,
            required: true,
            default: 1
        },
        test:{
            type: Schema.Types.ObjectId,
            ref: "Test"
        },
        subject:{
            type: Schema.Types.ObjectId,
            ref: "Subject"
        }
    },
    {
        timestamps: true
    }
)

export const Question = mongoose.model("Question", questionSchema)