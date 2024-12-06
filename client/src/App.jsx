import { useState, useEffect } from 'react'
import axios from "axios";
import io from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  // Establishing a connection from client to server
  const socket = io("http://localhost:3000"); // Correct server URL

  useEffect(() => {
    // Listen for incoming messages
    socket.on("Chat message", (msg) => {
      setMessages((messages) => [...messages, msg]);
    });

    // Cleanup when component unmounts
    return () => {
      socket.off("Chat message");
    };
  }, [message.length]);

  // Send message to server
  const sendMessage = () => {
    if (message) {
      socket.emit("Chat message", message); // Emit the message to server
      setMessage(""); // Clear the input field after sending
    }
  };

  // Handle message input
  const handleMessage = (e) => {
    setMessage(e.target.value); // Update message state as user types
  };

  // Fetch users from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setUsers(response.data); // Set users from API
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [users.length]);

  return (
    <>
      <div>
        <textarea
          name="message"
          value={message}
          placeholder="Enter message here..."
          onChange={handleMessage} // Handle input changes
        ></textarea>
        <button onClick={sendMessage}>Send</button>
      </div>

      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li> // Render each message
          ))}
        </ul>
      </div>

      <div>
        <h3>Users:</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user.name}</li> // Render users from the backend
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
