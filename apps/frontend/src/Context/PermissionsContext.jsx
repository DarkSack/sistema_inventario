import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../config/AxiosAdapter";

const PermissionsContext = createContext();

/**
 * Custom hook to use permissions context
 * @returns {object} - Contains permissions array and hasPermission function
 */
export const usePermissions = () => {
  return useContext(PermissionsContext);
};

/**
 * PermissionsProvider component
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.userId - User ID to fetch permissions for
 * @returns {JSX.Element} - PermissionsContext provider
 */
export const PermissionsProvider = ({ children, userId }) => {
  const [permissions, setPermissions] = useState([]);
  useEffect(() => {
    /**
     * Fetch permissions from API and cache in localStorage
     */
    const fetchPermissions = async () => {
      try {
        const cachedPermissions = localStorage.getItem(`permissions_${userId}`);
        if (cachedPermissions) {
          setPermissions(JSON.parse(cachedPermissions));
        } else {
          const response = await api.get(`/auth/permissions?id=${userId}`);
          const fetchedPermissions = response.data.permissions;
          setPermissions(fetchedPermissions);
          localStorage.setItem(
            `permissions_${userId}`,
            JSON.stringify(fetchedPermissions)
          );
        }
      } catch (error) {
        console.error("Error fetching permissions:", error?.message);
      }
    };

    if (userId) {
      fetchPermissions();
    }
  }, [userId]);

  /**
   * Check if a user has a specific permission
   * @param {string | string[]} permission - The permission to check
   * @returns {boolean} - True if the user has the permission, false otherwise
   */
  const hasPermission = (permission) => {
    if (Array.isArray(permission)) {
      return permission.some((perm) => perm.includes(permission));
    }
    return permissions.includes(permission);
  };

  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};

PermissionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  userId: PropTypes.string.isRequired,
};
