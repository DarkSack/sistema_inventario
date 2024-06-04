import { Route, Routes } from "react-router-dom";
import { LogInView } from "../View/utils/LogIn";
import { SignInView } from "../View/utils/SignIn";
import { FormProvider } from "./FormContext";
import { AdminBar } from "../View/Admin/AdminBar";
import { TopBar } from "../View/Clients/TopBar";
export const RouteNavigation = () => {
  const userRole =  localStorage.getItem("userRole")
  const authorizedRoles = [2, 3, 4, 5, "superadmin"];
  const isAuthorized = authorizedRoles.includes(userRole);

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
