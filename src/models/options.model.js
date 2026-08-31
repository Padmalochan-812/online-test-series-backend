import mongoose, {Schema} from "mongoose";

const optionsSchema = new Schema(
    {
    },
    {
        timestamps: true
    }
)

export const Options = mongoose.model("Options", optionsSchema)