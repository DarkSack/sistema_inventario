import { Route, Routes } from "react-router-dom";
import { LogInView } from "../View/utils/LogIn";
import { SignInView } from "../View/utils/SignIn";
import { FormProvider } from "./FormContext";
import { TopBar } from "../View/Clients/TopBar";

export const RouteNavigation = () => {
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
      <Route path="/dashboard" /> {/** Admin view*/}
    </Routes>
  );
};
