import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";


const chatUsers = new Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    messages: {
        type: [String]
    }
});


chatUsers.pre("save", async function(next){
    const user = this;
    if(user.isModified("password") || user.isNew){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    next();
})

export default mongoose.model("chatUsers", chatUsers);