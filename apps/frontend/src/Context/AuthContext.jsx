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
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const userCookie = Cookies.get("user");
    return userCookie ? JSON.parse(userCookie) : null;
  });

  /**
   * Iniciar sesión
   * @param {object} credentials - Credenciales de inicio de sesión
   * @returns {Promise<void>}
   */
  const signIn = async (credentials) => {
    try {
      const response = await api.post("/login", credentials, {});
      setUser(response.data.user);
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
      return response.data.user;
    } catch (error) {
      throw new Error(`Error during sign in: ${error.message}`);
    }
  };

  /**
   * Cerrar sesión
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      Cookies.remove("user");
      navigate("/signin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate]);

  /**
   * Handle redirects based on user state
   */
  useEffect(() => {
    if (user && window.location.pathname === "/signin") {
      navigate("/"); // Redirige a la página de inicio si hay sesión
    } else if (!user && window.location.pathname !== "/signin") {
      navigate("/signin"); // Redirige a la página de inicio de sesión si no hay sesión
    }
  }, [user, navigate]);

  const value = {
    user,
    signIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
