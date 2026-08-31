import mongoose, {Schema} from "mongoose";

const testSchema = new Schema(
    {
        title: {
            types: String,
            required: true
        },
        duration: {
            types: Number,
            required: true
        },
        totalMarks: {
            types: Number,
            required: true
        },
        totalTime: {
            types: Number,
            required: true
        },
        startTime: {
            types: Date,
            required: true
        },
        endTime: {
            types: Date,
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