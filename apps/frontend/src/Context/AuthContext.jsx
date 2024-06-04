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
  const [userRole, setUserRole] = useState(false);
  const [loading, setLoading] = useState(true); // Añadido estado de loading

  const signIn = async (provider) => {
    try {
      const { data } = await api.get(`/auth/login?provider=${provider}`);
      window.location.href = data;
    } catch (error) {
      console.error("SignIn Error:", error.message);
      throw new Error(error.message);
    }
  };

  const checkAuthorization = async (id) => {
    try {
      const response = await api.get(`/get/userRole?id=${id}`);
      localStorage.setItem("userRole", response.data.data.userRole);
      return response.data.data.userRole;
    } catch (error) {
      return false;
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

        if (session?.user) {
          const storedIsAuthorized = localStorage.getItem("userRole");

          if (storedIsAuthorized !== null) {
            setUserRole(storedIsAuthorized === "true");
          } else {
            const userRole = await checkAuthorization(session.user.id);
            setUserRole(userRole);
          }
        }

        setLoading(false); // Set loading to false after data is set
      } catch (error) {
        setLoading(false); // Set loading to false in case of error
        throw new Error(error.message);
      }
    };

    setData();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setSession(session);
          setUser(session?.user);

          if (session?.user) {
            const storedIsAuthorized = localStorage.getItem("userRole");

            if (storedIsAuthorized !== null) {
              setUserRole(storedIsAuthorized === "true");
            } else {
              const userRole = await checkAuthorization(session.user.id);
              setUserRole(userRole);
            }
          }

          setLoading(false); // Set loading to false after auth state change
        } catch (error) {
          console.error("Error in onAuthStateChange listener:", error.message);
          setLoading(false); // Set loading to false in case of error
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [currentPath, navigate]);

  const value = {
    session,
    user,
    userRole,
    signIn,
    signOut: () => {
      supabase.auth.signOut();
      localStorage.removeItem("userRole"); // Limpiar localStorage al cerrar sesión
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
