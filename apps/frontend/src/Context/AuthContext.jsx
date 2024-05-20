import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase.config";
import jwt from "jsonwebtoken";
const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [sessionUser, setSessionUser] = useState([]);
  const [errors, setErrors] = useState("");

  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      localStorage.setItem("provider", "Google");
      if (error) throw new Error("Error al iniciar sesión con Google");
      return data;
    } catch (error) {
      setErrors(error.message);
    }
  }

  async function signInWithDiscord() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
      });
      localStorage.setItem("provider", "Discord");
      if (error) throw new Error("Error al iniciar sesión con Discord");
      return data;
    } catch (error) {
      setErrors(error.message);
    }
  }

  async function signInWithTwitch() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "twitch",
      });
      localStorage.setItem("provider", "Twitch");
      if (error) throw new Error("Error al iniciar sesión con Twitch");
      return data;
    } catch (error) {
      setErrors(error.message);
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log(error);
        throw new Error("Ha ocurrido un error al cerrar sesión");
      }
      localStorage.clear();
    } catch (error) {
      setErrors(error.message);
    }
  }

  useEffect(() => {
    const handleAuthStateChange = async (e, session) => {
      try {
        const currentPath = window.location.pathname;
        if (session == null) {
          console.log("No session");
        } else if (currentPath === "/") {
          window.location.href = "/dashboard";
        } else {
          const userPasswordHashed = jwt.sign(
            {
              userId: session.user.id,
              userName: session.user.user_metadata.nickname,
              userEmail: session.user.email,
            },
            import.meta.env.VITE_APP_SERVICE_ROLE,
            { expiresIn: 8640000 }
          );
          setSessionUser(session);
          localStorage.setItem("userId", session.user.id);
          await supabase.from("users").upsert([
            {
              userId: session.user.id,
              userName: session.user.user_metadata.nickname,
              userEmail: session.user.email,
              userPasswordHashed,
              userRole: "admin",
            },
          ]);
          setUser(session?.user?.user_metadata);
          localStorage.setItem("passwordHashed", userPasswordHashed);
        }
      } catch (error) {
        setErrors(error.message);
      }
    };
    const { data: AuthListener, error } = supabase.auth.onAuthStateChange(
      handleAuthStateChange
    );
    if (error) {
      setErrors(error.message);
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
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
