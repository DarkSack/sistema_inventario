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

  const signIn = async (provider) => {
    try {
      const { data } = await api.get(`/auth/login?provider=${provider}`);
      window.location.href = data;
    } catch (error) {
      console.error("SignIn Error:", error.message);
      throw new Error(error.message);
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

  const value = {
    session,
    user,
    loading,
    signIn,
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
