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
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  /**
   * Iniciar sesión
   * @param {object} credentials - Credenciales de inicio de sesión
   */
  const signIn = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
    } catch (error) {
      throw new Error(`Error during sign in: ${error.message}`);
    }
  };

  /**
   * Register
   * @param {object} credentials
   */
  const singUp = async (credentials) => {
    try {
      const response = await api.post("/auth/register", credentials);
      Cookies.set("user", JSON.stringify(response.data.user), { expires: 7 });
    } catch (error) {
      throw new Error(`Error during sign up: ${error.message}`);
    }
  };

  /**
   * Cerrar sesión
   */
  const logout = useCallback(async () => {
    try {
      setUser(null);
      Cookies.remove("user");
      navigate("/signin");
    } catch (error) {
      throw new Error("Error during logout:", error);
    }
  }, [navigate]);

  /**
   * Handle redirects based on user state
   */
  useEffect(() => {
    if (
      (user || Cookies.get("user")) &&
      window.location.pathname === "/signin"
    ) {
      navigate("/"); // Redirige a la página de inicio si hay sesión
    } else if (!user && window.location.pathname !== "/signin") {
      navigate("/signin"); // Redirige a la página de inicio de sesión si no hay sesión
    }
  }, [user, navigate]);
  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const decodedUser = jwtDecode(userCookie);
        setUser(decodedUser);
      } catch (error) {
        setUser(null);
        throw new Error("Invalid token", error);
      }
    }
  }, []);

  const value = {
    user,
    signIn,
    singUp,
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
