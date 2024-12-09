import express from "express"
import dotenv from "dotenv";
import {Server} from "socket.io";
import http from "http";
import cors from "cors"
import {connectToTheDatabase} from "./utils/database.js"
import { error } from "console";
import userRoutes from "./routes/route.js"
import users from "./dataSchemas/users.js";

dotenv.config();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
}

const app = express();
const server  = http.createServer(app);
app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User connected");
  
    socket.on("join chat", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });
  
    socket.on("private message", ({ senderId, receiverId, message }) => {
      io.to(receiverId).emit("private message", { senderId, message });
      console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
});
  

//Routes
app.use("/api", userRoutes);

app.use((error, req, res, next) => {
    const errorMessage = error.message || "Something went wrong";
    const errorStatus = error.status || 500;
    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: errorMessage.stack,
    });
})





server.listen(process.env.PORT, () => {
    console.log(`Server running at ----> http://locaolhost:${process.env.PORT}`);
    connectToTheDatabase();
});