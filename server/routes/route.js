import express from "express";
import { RegisterUser, getOneUser, getAllUsers, userLogin, deleteUser } from "../controllers/usersControllers.js";
import { createMessage, deleteMessage } from "../controllers/messageController.js";

const route = express.Router();

//User Routes
route.use("/register", RegisterUser);
route.use("/user/:id", getOneUser);
route.use("/allusers", getAllUsers);
route.use("/login", userLogin);
route.use("/delete-user/:id", deleteUser);

//Messages Route
route.use("/newmessage", createMessage);
route.use("/delmessage", deleteMessage);

export default route;