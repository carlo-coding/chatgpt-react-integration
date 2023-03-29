import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "wouter";
import Button from "../Button";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Sidebar.css";

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(2);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

function Sidebar() {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const [chats, setChats] = useState([]);
  const [, navigate] = useLocation();

  function handleLogout() {
    removeCookie("token", { path: "/" });
    window.location.assign("/");
  }

  function handleRedirect(id) {
    navigate(`/chat/${id}`);
  }

  function handleDelete(id) {
    const deleteChat = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/chats/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + cookies.token,
            },
          }
        );
        if (response.ok) {
          setChats(chats.filter((chat) => chat.id !== id));
          if (chats.length > 0) {
            navigate("/chat/" + chats[0].id);
          }
          window.location.reload();
        }
      } catch (err) {
        console.log(err);
      }
    };
    deleteChat();
  }

  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/chats`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + cookies.token,
            },
          }
        );
        const data = await response.json();
        if (data.chats) setChats(data.chats);
      } catch (err) {
        setChats([]);
      }
    };
    getChats();
  }, []);

  return (
    <div className="sidebar">
      <p>History</p>
      <div className="chats">
        {chats.map((chat) => (
          <div
            className="chat"
            key={chat.id}
            onClick={() => handleRedirect(chat.id)}
          >
            <div className="chat__name">
              {formatDate(new Date(chat.created_at))}
            </div>
            <DeleteIcon
              sx={{ fontSize: "16px" }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(chat.id);
              }}
            />
          </div>
        ))}
      </div>
      <div className="actions">
        <Button onClick={handleLogout}>Logout</Button>
        <Button onClick={() => navigate("/subscribe")}>Subscribe</Button>
      </div>
    </div>
  );
}
export default Sidebar;
