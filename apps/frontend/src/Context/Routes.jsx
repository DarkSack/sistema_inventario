import { Route, Routes } from "react-router-dom";
import { LogInView } from "../View/utils/LogIn";
import { SignInView } from "../View/utils/SignIn";
import { FormProvider } from "./FormContext";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../View/Clients/TopBar";
import { useUserAuth } from "./AuthContext";
import { AdminProductsView } from "../View/Admin/Products";

export const RouteNavigation = () => {
  const navigate = useNavigate();
  const { sessionUser } = useUserAuth();
  if(!sessionUser){
    const currentPath = window.location.pathname;
    if (currentPath === "/signin" || currentPath === "/login") {
      if (currentPath === "/signin" || currentPath === "/login") {
        navigate(currentPath);
      } else {
        navigate("/signin");
      }

    }
  }
  return (
    <Routes>
      <Route path="/login" element={<LogInView />} /> {/** Login view*/}
      <Route
        path="/signin"
        element={
          <FormProvider>
            <SignInView />
          </FormProvider>
        }
      />
      {/** Signin view*/}
      <Route path="/" element={<TopBar />} /> {/** User view*/}
      <Route path="/dashboard" element={<AdminProductsView/>} /> {/** Admin view*/}
    </Routes>
  );
};
