import mongoose, {Schema} from "mongoose";

const test_seriesSchema = new Schema(
    {   
        banner: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
            index: true
        },
        description: {
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        discountPrice:{
            type: Number
        },
        discountPercentage: {
            type: Number
        }
    },
    { 
        timestamps: true
    }
)

export const Test_Series = mongoose.model("Test_Series", test_seriesSchema)