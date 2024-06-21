import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import api from "../config/AxiosAdapter";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Iniciar sesión
   * @param {object} credentials - Credenciales de inicio de sesión
   * @returns {Promise<void>}
   */
  const signIn = async (credentials) => {
    try {
      const response = await api.post("/login", credentials, {
        withCredentials: true,
      });
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(`Error during sign in: ${error.message}`);
    }
  };
  console.log(user);
  /**
   * Cerrar sesión
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/signin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate]);

  /**
   * @param {object} credentials
   * @returns {object}
   */
  const login = async () => {};

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data.user);
      } catch (error) {
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && window.location.pathname === "/signin") {
        navigate("/"); // Redirige a la página de inicio si hay sesión
      } else if (!user && window.location.pathname !== "/signin") {
        navigate("/signin"); // Redirige a la página de inicio de sesión si no hay sesión
      }
    }
  }, [loading, user, navigate]);

  const value = {
    user,
    loading,
    signIn,
    login,
    logout,
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
