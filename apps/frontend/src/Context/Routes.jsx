import { Route, Routes } from "react-router-dom";
import { LogInView } from "../View/utils/LogIn";
import { AdminBar } from "../View/Admin/AdminBar";
import { TopBar } from "../View/Clients/TopBar";
import { usePermissions } from "../Context/PermissionsContext";
import { FormProvider } from "./FormContext";
import { SignInView } from "../View/utils/SingIn";
export const RouteNavigation = () => {
  const { hasPermission } = usePermissions();
  const isAuthorized = hasPermission("admin_dashboard");
  return (
    <Routes>
      <Route path="/login" element={<LogInView />} />
      <Route
        path="/signin"
        element={
          <FormProvider>
            <SignInView />
          </FormProvider>
        }
      />
      <Route path="/" element={isAuthorized ? <AdminBar /> : <TopBar />} />
    </Routes>
  );
};
