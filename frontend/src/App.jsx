import { useEffect, useState } from "react";
import { useLocation, Route, useRoute } from "wouter";
import ReactMarkdown from "react-markdown";
import "./App.css";
import Chat from "./components/Chat";

const ChatApp = () => {
  // Get chatId from wouter params
  const [match, params] = useRoute("/chat/:id");
  const chatId = params.id;

  // Initialize state for chat history and current message
  const [history, setHistory] = useState([]);

  // Send message to backend API and update chat history
  const sendMessage = async (message) => {
    const response = await fetch(`http://localhost:3000/chat/${chatId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    setHistory([
      ...history,
      { id: `user${chatId}`, name: "User", message: message, type: "mine" },
      {
        id: `bot${chatId}`,
        name: "Assistant",
        message: data.response,
        type: "friend",
      },
    ]);
  };

  return (
    <div className="chat-container">
      <Chat
        myName={"User"}
        myId={chatId}
        disabled={false}
        messages={history}
        sendMessage={(message) => sendMessage(message)}
      />
    </div>
  );
};

const App = () => {
  const randomChatId = Math.random().toString(16).slice(2);
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/chat/" + randomChatId);
  }, []);
  return (
    <div>
      <Route path="/chat/:id" component={ChatApp} />
    </div>
  );
};
export default App;
