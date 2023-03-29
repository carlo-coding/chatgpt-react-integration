import "./Landing.css";
import { GoogleLogin } from "@react-oauth/google";
import mygptImage from "../../assets/mygptcapture.png";
import { useCookies } from "react-cookie";

export default function Landing() {
  const [, setCookie] = useCookies(["token"]);
  const handleGoogleResponse = async ({ credential }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/signin/google`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential }),
      }
    );
    const data = await response.json();
    setCookie("token", data.data.token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    window.location.reload();
  };

  return (
    <div className="landing-container">
      <h1>Welcome to myGPT, the GPT-4 Powered Chatbot</h1>
      <p>
        Explore the world of advanced conversational AI with myGPT, a chatbot
        powered by the cutting-edge GPT-4 technology.
      </p>
      <img src={mygptImage} alt="Chatbot" className="chatbot-image" />
      <p>Continue by login or creating an account with your Google account.</p>
      <p>By creating an account you accept the terms of service</p>
      <GoogleLogin
        onSuccess={handleGoogleResponse}
        onError={() => {
          console.error("Error on google signup");
        }}
      />
    </div>
  );
}
