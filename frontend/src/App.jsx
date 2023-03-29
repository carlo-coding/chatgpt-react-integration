import { useEffect } from "react";
import { useLocation, Route } from "wouter";
import "./App.css";
import Landing from "./pages/Landing/Landing";
import Subscribe from "./pages/Subscribe/Subscribe";
import Mygpt from "./pages/Mygpt/Mygpt";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "./common/routes";
import { useCookies } from "react-cookie";
import { SnackbarProvider } from "notistack";

const App = () => {
  const [location, navigate] = useLocation();
  const [cookies] = useCookies(["token"]);
  useEffect(() => {
    if (cookies.token) {
      return navigate("/chat/");
    }
    if (location.startsWith("/chat") && !cookies.token) {
      return navigate("/");
    }
    if (location.startsWith("/profile") && !cookies.token) {
      return navigate("/");
    }
  }, []);
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <SnackbarProvider maxSnack={3}>
        <Route path={PUBLIC_ROUTES.HOME} component={Landing} />
        <Route path={PUBLIC_ROUTES.SUBSCRIBE} component={Subscribe} />
        <Route path={PRIVATE_ROUTES.CHAT} component={Mygpt} />
        <Route path={`${PRIVATE_ROUTES.CHAT}/:id`} component={Mygpt} />
      </SnackbarProvider>
    </GoogleOAuthProvider>
  );
};
export default App;
