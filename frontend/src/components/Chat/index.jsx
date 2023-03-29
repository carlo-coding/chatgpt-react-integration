import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import Button from "../Button";
import Input from "../Input";
import "./Chat.css";

const scrollGap = 800;
function autoScroll(elementRef) {
  if (!elementRef) return;
  const { scrollTop, scrollHeight } = elementRef;
  if (scrollTop <= scrollHeight - scrollGap) return;
  elementRef.scroll(0, elementRef.scrollHeight);
}

function Chat({ myId, myName, messages, sendMessage, ...props }) {
  const [myMessage, setMyMessage] = useState("");
  const [allMessages, setAllMessages] = useState(messages);
  const chatRef = useRef(null);
  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!myMessage) return;
    sendMessage(myMessage);
    setMyMessage("");
    setAllMessages((prev) => [
      ...prev,
      { id: myId, name: myName, message: myMessage, type: "mine" },
    ]);
  };

  useEffect(() => {
    setAllMessages(messages);
  }, [messages]);

  useEffect(() => {
    // Autoscroll behaviour on new messages
    autoScroll(chatRef.current);
  }, [allMessages]);

  return (
    <div className="chat-cont">
      <div className="chat" ref={chatRef}>
        {allMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.type === "mine" ? "my-message" : "friend-message"
            }`}
          >
            <span className="username">{msg.name}</span>
            <div className="text">
              <ReactMarkdown>{msg.message}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <form className="user-input" onSubmit={handleSendMessage}>
        <Input
          {...props}
          name="message"
          value={myMessage}
          onChange={(e) => setMyMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

export default Chat;
