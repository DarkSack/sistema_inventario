// src/context/PermissionsContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../config/AxiosAdapter";

const PermissionsContext = createContext();

export const usePermissions = () => {
  return useContext(PermissionsContext);
};

export const PermissionsProvider = ({ children, userId }) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
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
        throw new Error("Error fetching permissions:", error?.message);
      }
    };

    if (userId) {
      fetchPermissions();
    }
  }, [userId]);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  return (
    <PermissionsContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
};
PermissionsProvider.propTypes = {
  children: PropTypes.node,
  userId: PropTypes.string,
};
