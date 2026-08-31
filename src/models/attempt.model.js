import mongoose, {Schema} from "mongoose";

const attemptSchema = new Schema(
    {
    },
    {
        timestamps: true
    }
)

export const Attempt = mongoose.model("Attempt", attemptSchema)