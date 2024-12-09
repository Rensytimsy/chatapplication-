import mongoose, {Schema} from "mongoose";

const userMessage = new Schema({
    content: {
        type: String,
        required: true
    },
},{timestamps: true});

export default mongoose.model("chatMessages", userMessage);