import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../../../api/src/SupabaseClient";
import api from "../config/AxiosAdapter";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);


  /**
   * @param {string} provider
   * @param {object} credentials
   * @returns {object}
   */
  const signIn = async (provider, credentials) => {
    try {
      if (provider === "WithCredentials") {
        // Solicitar autenticación con credenciales
        const response = await api.post("/auth/login", {
          provider,
          credentials,
        });
        return response.data;
      } else {
        // Solicitar autenticación con un proveedor
        const response = await api.post("/auth/login", { provider });
        window.location.href = response.data.url; // Redirigir a la URL de autenticación del proveedor
      }
    } catch (error) {
      throw new Error(`Error during sign in: ${error.message}`);
    }
  };

  /**
   * @param {object} credentials
   * @returns {object}
   */
  const login = async (credentials) => {
    try {
      const { email, password } = credentials;
      const { session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      setSession(session);
      setUser(session.user);
      return session;
    } catch (error) {
      throw new Error(`Error during login: ${error.message}`);
    }
  };

  useEffect(() => {
    const setData = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw new Error(error.message);

        setSession(session);
        setUser(session?.user);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw new Error(error.message);
      }
    };

    setData();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setSession(session);
          setUser(session?.user);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          throw new Error(
            "Error in onAuthStateChange listener:",
            error.message
          );
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [currentPath, navigate]);

  useEffect(() => {
    if (!loading) {
      if (session) {
        navigate("/"); // Redirige a la página de inicio si hay sesión
      } else {
        navigate("/signin"); // Redirige a la página de inicio de sesión si no hay sesión
      }
    }
  }, [loading, session, navigate]);

  const value = {
    session,
    user,
    loading,
    signIn,
    login,
    signOut: () => {
      supabase.auth.signOut();
      setUser(null);
      setSession(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Export the hook
export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
