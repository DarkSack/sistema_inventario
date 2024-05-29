import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase.config";
import bcrypt from "bcryptjs";
const AuthContext = createContext();
import api from "../config/AxiosAdapter";
// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [sessionUser, setSessionUser] = useState([]);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  /**
   * purpose: Sigin a new user
   * @param {string} provider
   * @param {object} credentials
   * @returns {object}
   */
  async function signIn(provider) {
    try {
      await api.post("/auth/login", { provider });
      // Supabase redirigirá automáticamente al usuario al proveedor de autenticación
    } catch (error) {
      console.error(error);
      throw new Error("Error al iniciar sesión con el proveedor");
    }
  }

  /**
   * Function to logout
   */
  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error("Ha ocurrido un error al cerrar sesión");
      }
      localStorage.clear();
    } catch (error) {
      setErrors(error.message);
    }
  }

  /**
   *
   * purpose: Login in your account
   * @param {string} email
   * @param {string} password
   * @returns
   */
  async function login(email, password) {
    try {
      // Obtener el usuario desde la base de datos por correo electrónico
      const { data: user, error } = await supabase
        .from("users")
        .select("userPassHash") // Seleccionar el campo donde se almacena el hash de la contraseña
        .eq("userEmail", email)
        .single();

      if (error) {
        throw error;
      }
      // Comparar la contraseña ingresada con el hash almacenado
      const isPasswordValid = bcrypt.compareSync(password, user.userPassHash);
      if (!isPasswordValid) {
        throw new Error("Usuario o contraseña incorrecta");
      }
      // Iniciar sesión con Supabase
      const { user: authUser, error: authError } = await supabase.auth.signIn({
        email,
        password,
      });
      if (authError) {
        throw authError;
      }
      return authUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  useEffect(() => {
    const handleAuthStateChange = async (event, session) => {
      try {
        const currentPath = window.location.pathname;
        if (!session) {
          if (currentPath === "/signin" || currentPath === "/login") {
            navigate(currentPath);
          } else {
            navigate("/signin");
          }
        } else {
          // Usar memoización para evitar solicitudes duplicadas
          const cachedUser = localStorage.getItem("userRole");
          let userRole;

          if (cachedUser) {
            userRole = JSON.parse(cachedUser);
          } else {
            const { data, error } = await supabase
              .from("users")
              .select("userRole")
              .eq("userEmail", session.user.email)
              .single();
            if (error) throw error;
            userRole = data;
            localStorage.setItem("userRole", JSON.stringify(userRole));
          }
          const isAdmin = userRole && userRole.userRole === "admin";
          setSessionUser(session);
          localStorage.setItem("userId", session.user.id);
          // Evitar solicitudes de upsert duplicadas
          if (!localStorage.getItem("userInserted")) {
            const { error: upsertError } = await supabase.from("users").upsert({
              userName: session.user.user_metadata.nickname,
              userEmail: session.user.email,
              userRole: "user",
            });
            if (upsertError) throw upsertError;
            localStorage.setItem("userInserted", "true");
          }
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
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        login,
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
