import userSchema from "../dataSchemas/users.js";
import mssgSchema from "../dataSchemas/messages.js"

//create message
export const createMessage = async(req, res, next) => {
    try{
        const newMessage = await mssgSchema(req.body);
        await newMessage.save();
        res.status(200).json(newMessage);
    }catch(error){
        next(error);
    }
}

export const deleteMessage = async(req, res, next) => {
    try{
        await mssgSchema.findByIdAndDelete(req.params.id);
        res.status(200).json("Message deleted");
    }catch(error){
        next(error);
    }
}