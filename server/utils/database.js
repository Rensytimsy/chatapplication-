import mongoose from "mongoose";

export const connectToTheDatabase = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to the db");
    }catch(error){
        console.log(error);
    }
}