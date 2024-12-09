import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./utils/useContext";
import { io } from "socket.io-client";

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [messages, setMessage] = useState(""); // For input field
  const [chat, setChat] = useState([]); // All chat messages
  const [chatUser, setChatUser] = useState([]); // All users
  const [isSelected, setIsSelected] = useState(null); // Selected user ID
  const [currentUser, setCurrentUser] = useState({}); // Current selected user
  const [socket, setSocket] = useState(null); // Socket instance

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    if (user && user._id) {
      newSocket.emit("join chat", user._id);
    }

    newSocket.on("private message", ({ senderId, message }) => {
      setChat((prevChat) => [...prevChat, { senderId, message }]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/allusers");
        setChatUser(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatUsers();
  }, []);

  const sendMessages = (receiverId) => {
    if (!receiverId || !messages.trim()) {
      console.log("Receiver ID or message is missing");
      return;
    }

    socket.emit("private message", {
      senderId: user._id,
      receiverId,
      message: messages,
    });

    setChat((chat) => [...chat, { senderId: user.name, message: messages }]);
    setMessage(""); // Clear input field
  };

  const getUser = async (uId) => {
    setIsSelected((prev) => (prev === uId ? null : uId));
    try {
      const response = await axios.get(`http://localhost:3000/api/user/${uId}`);
      setCurrentUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative bg-blue-300 flex h-screen w-full">
      {/* Sidebar for Users */}
      <div className="bg-blue-500 text-white w-1/4 h-full flex flex-col py-4">
        <h2 className="text-lg font-bold text-center mb-4">Chats</h2>
        <ul className="space-y-2 px-4">
          {chatUser.map((person) => (
            <li
              key={person._id}
              className="bg-blue-600 p-3 rounded-lg shadow-md cursor-pointer hover:bg-blue-700"
              onClick={() => getUser(person._id)}
            >
              <p>{person?.name}</p>
              <li>{chat.length > 0 ? chat.length : 0}</li>
            </li>
          ))}
        </ul>
      </div>

      {isSelected && (
        <div className="flex-1 bg-white flex flex-col h-full overflow-hidden">
          <div className="bg-blue-500 text-white p-4 text-center text-lg font-bold">
            <p>{currentUser?.name}</p>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.senderId === user.name ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg shadow max-w-[70%] ${
                    msg.senderId === user.name
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p className="text-sm font-medium text-blue-600">
                    {msg.senderId}
                  </p>
                  <p>{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center p-4 bg-gray-100 border-t">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
              value={messages}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
              onClick={() => sendMessages(currentUser._id)}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
