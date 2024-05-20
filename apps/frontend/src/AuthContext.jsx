import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase.config";
import axios from "axios";
const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const server =
    import.meta.env.DEV === true
      ? import.meta.env.VITE_LOCAL_URL
      : import.meta.env.VITE_PROD_URL;
  const [user, setUser] = useState([]);
  const [sessionUser, setSessionUser] = useState([]);

  async function signInWithGoogle() {
    try {
      const response = await axios.post(`${server}/login`, {
        provider: "google",
      });
      console.log("Inicio de sesión con Google exitoso:", response.data);
    } catch (error) {
      console.error(
        "Error al iniciar sesión con Google:",
        error.response ? error.response.data : error.message
      );
    }
  }

  async function signInWithDiscord() {
    try {
      const response = await axios.post(`${server}/login`, {
        provider: "discord",
      });
      console.log("Inicio de sesión con Discord exitoso:", response.data);
    } catch (error) {
      console.error(
        "Error al iniciar sesión con Discord:",
        error.response ? error.response.data : error.message
      );
    }
  }

  async function signInWithTwitch() {
    try {
      const response = await axios.post(`${server}/login`, {
        provider: "twitch",
      });
      console.log("Inicio de sesión con Twitch exitoso:", response.data);
    } catch (error) {
      console.error(
        "Error al iniciar sesión con Twitch:",
        error.response ? error.response.data : error.message
      );
    }
  }

  async function signOut() {
    try {
      const response = await axios.post(`${server}/logout`);
      console.log("Cierre de sesión exitoso:", response.data);
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error.response ? error.response.data : error.message
      );
    }
  }

  useEffect(() => {
    const handleAuthStateChange = async (e, session) => {
      try {
        const currentPath = window.location.pathname;
        if (session == null) {
          console.log("No session");
        } else if (currentPath === "/") {
          console.log("====================================");
          console.log(session);
          console.log("====================================");
          setSessionUser(session);
        } else {
          console.log("====================================");
          console.log(session);
          console.log("====================================");
          setSessionUser(session);
          localStorage.setItem("connected", true);
          await supabase.from("users").upsert([
            {
              user_id: session.user.id,
              nickname: session.user.user_metadata.nickname,
              email: session.user.email,
              name: session.user.user_metadata.name,
              avatar_url: session.user.user_metadata.avatar_url,
            },
          ]);
          setUser(session?.user?.user_metadata);
          localStorage.setItem(
            "userInfo",
            JSON.stringify(session?.user?.user_metadata)
          );
        }
      } catch (error) {
        console.log("Error", error);
      }
    };
    const { data: AuthListener, error } = supabase.auth.onAuthStateChange(
      handleAuthStateChange
    );

    if (error) {
      console.error("Error", error);
    }

    return () => {
      if (AuthListener && AuthListener.unsubscribe) {
        AuthListener.unsubscribe();
      }
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{
        signInWithGoogle,
        signInWithDiscord,
        signInWithTwitch,
        signOut,
        user,
        sessionUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
