import { Route, Routes } from "react-router-dom";
import { LogInView } from "../View/utils/LogIn";
import { SignInView } from "../View/utils/SignIn";
import { AdminBar } from "../View/Admin/AdminBar";
import { TopBar } from "../View/Clients/TopBar";
import { usePermissions } from "../Context/PermissionsContext";
export const RouteNavigation = () => {
  const { hasPermission } = usePermissions();
  const isAuthorized = hasPermission("admin_dashboard");
console.log('====================================');
console.log(isAuthorized);
console.log('====================================');
  return (
    <Routes>
      <Route path="/login" element={<LogInView />} />
      <Route path="/signin" element={<SignInView />} />
      <Route path="/" element={isAuthorized ? <AdminBar /> : <TopBar />} />
    </Routes>
  );
};
