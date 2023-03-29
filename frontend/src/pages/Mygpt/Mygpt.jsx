import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import "./Mygpt.css";
import Chat from "../../components/Chat";
import { useCookies } from "react-cookie";
import Sidebar from "../../components/Sidebar/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Drawer } from "@mui/material";
import { enqueueSnackbar } from "notistack";

const ChatApp = () => {
  const [cookies] = useCookies(["token"]);
  const [match, params] = useRoute("/chat/:id");
  const [, navigate] = useLocation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const sendMessage = async (message) => {
    if (!params?.id || !message) return;
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/chats/${params?.id}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.token,
        },
        body: JSON.stringify({ message }),
      }
    );
    const data = await response.json();
    const respMessage = data.message;
    if (response.status === 400) {
      enqueueSnackbar("Subscribe to a plan to keep using the app", {
        variant: "error",
      });
    }
    setLoading(false);
    if (!respMessage) return;
    setHistory([
      ...history,
      {
        id: `user-${respMessage.id}`,
        name: "User",
        message: message,
        type: "mine",
      },
      {
        id: `bot-${respMessage.id}`,
        name: "Assistant",
        message: respMessage.assistant_response,
        type: "friend",
      },
    ]);
  };

  useEffect(() => {
    if (params?.id) {
      const fetchChat = async () => {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/chats/${params.id}/messages`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + cookies.token,
            },
          }
        );
        const data = await response.json();
        if (data.messages) {
          const messages = data.messages.flatMap((message) => {
            return [
              {
                id: `user-${message.id}`,
                name: "User",
                message: message.user_question,
                type: "mine",
              },
              {
                id: `bot-${message.id}`,
                name: "Assistant",
                message: message.assistant_response,
                type: "friend",
              },
            ];
          });
          setHistory(messages);
        }
      };
      fetchChat();
      return;
    }
    const fetchEmptyChat = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/empty-chat`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies.token,
          },
        }
      );
      const data = await response.json();
      if (data.chatId) return navigate(`/chat/${data.chatId}`);
      navigate(`/`);
    };
    fetchEmptyChat();
  }, [params?.id]);
  return (
    <Box
      className="chat-container"
      sx={{
        paddingLeft: {
          md: "200px",
          xs: "0px",
        },
      }}
    >
      <Box
        sx={{
          position: "fixed",
          top: "0.5rem",
          right: "0.5rem",
          display: {
            md: "none",
            xs: "block",
          },
        }}
      >
        <MenuIcon
          sx={{ fontSize: "2rem", color: "white" }}
          onClick={() => setOpenDrawer(true)}
        />
      </Box>
      <Box
        sx={{
          display: {
            md: "block",
            xs: "none",
          },
        }}
      >
        <Sidebar />
      </Box>
      <Drawer
        sx={{
          display: {
            md: "none",
            xs: "block",
          },
        }}
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Sidebar />
      </Drawer>
      <Chat
        myName={"User"}
        myId={params?.id}
        disabled={loading}
        messages={history}
        sendMessage={(message) => sendMessage(message)}
      />
    </Box>
  );
};

export default ChatApp;
