import express from "express";
import chatUser from "../dataSchemas/users.js";
import { createError } from "../utils/createError.js";
import bcrypt from "bcryptjs"
// const route = express.Router();

export const RegisterUser = async(req, res, next) => {
    try{
        const newUser = new chatUser(req.body);
        await newUser.save();
        res.status(200).json(newUser);
    }catch(error){
        next(error);
    }
};

export const getOneUser = async(req, res,next) => {
    try{
        const user = await chatUser.findById(req.params.id);
        res.status(200).json(user);
    }catch(error){
        next(error);
    }
}

export const getAllUsers = async(req, res, next) => {
    try{
        const allUsers = await chatUser.find();
        res.status(200).json(allUsers);
    }catch(error){
        next(error);
    }
}

//Login functionality
export const userLogin = async(req, res, next) => {
    try{
        const isUser = await chatUser.findOne({name: req.body.name});
        if(!isUser) return next(createError(403, "Invalid username"));

        const isPsswd = await bcrypt.compare(req.body.password, isUser.password);
        if(!isPsswd) return next(createError(403, "Invalid password"));

        res.status(200).json(isUser);
    }catch(error){

    }
}

export const deleteUser = async(req, res, next) => {
    try{
        await chatUser.findByIdAndDelete(req.params.id);
        res.status(200).json("deleted!")
    }catch(error){
        next(error);
    }
}

