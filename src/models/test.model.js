import mongoose, {Schema} from "mongoose";

const testSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        totalMarks: {
            type: Number,
            required: true
        },
        totalTime: {
            type: Number,
            required: true
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,
            required: true
        },
        testSeries:{
            type: Schema.Types.ObjectId,
            ref: "TestSeries"
        }
    },
    {
        timestamps: true
    }
)

export const Test = mongoose.model("Test", testSchema)

