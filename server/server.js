import express, { json } from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// Load environment variables
dotenv.config();

const corsOptions = {
    origin: "http://localhost:5173/", // Frontend URL
    methods: ["GET", "POST"],
};

// Setting up Express app and Socket.IO server
const app = express();
app.use(cors(corsOptions));
app.use(json());

const server = http.createServer(app);
const io = new Server(server);

// Listening for socket connections
io.on("connection", (socket) => {
    console.log("User Connected");

    // Listening for chat messages from client
    socket.on("Chat message", (msg) => {
        console.log("Received message:", msg); // Log the received message on the server
        io.emit("Chat message", msg); // Broadcast the message to all connected clients
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected");
    });
});

// User data
const users = [
    { name: "Timo", age: 20, address: "Nairobi, Ruiru" },
    { name: "Erick", age: 25, address: "Embu, Majimbo" }
];

// Routes
app.get("/", (req, res) => {
    res.status(200).send("Hello, server is running");
});

app.get("/users", (req, res) => {
    res.status(200).json(users); // Return users list
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
