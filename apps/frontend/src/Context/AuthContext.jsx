import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase.config";
const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [sessionUser, setSessionUser] = useState([]);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const isAdmin = true;
  async function signIn(provider, credentials) {
    try {
      let data, error;
      if (provider === "withPassword") {
        const { email, password } = credentials;
        ({ user: data, error } = await supabase.auth.signIn({
          email,
          password,
        }));
      } else {
        ({ data, error } = await supabase.auth.signInWithOAuth({ provider }));
        localStorage.setItem("provider", provider);
      }
      if (error) {
        throw new Error(
          `Error al iniciar sesión con ${provider}: ${error.message}`
        );
      }
      return data;
    } catch (error) {
      setErrors(error.message);
    }
  }
  async function signOut(e) {
    e.preventDefault();
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
        if (!session) {
          navigate("/login");
        } else {
          const userRole = isAdmin ? "admin" : "user";
          setSessionUser(session);
          localStorage.setItem("userId", session.user.id);
          await supabase.from("users").upsert([
            {
              userId: session.user.id,
              userName: session.user.user_metadata.nickname,
              userEmail: session.user.email,
              userRole,
            },
          ]);
          setUser(session.user.user_metadata);
          navigate(isAdmin ? "/dashboard" : "/");
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
  }, [isAdmin, navigate]);
  return (
    <AuthContext.Provider
      value={{
        signIn,
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
