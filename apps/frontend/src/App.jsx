import "./App.css";
import "@mantine/core/styles.css";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import { RouteNavigation } from "./Context/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { PermissionsProvider } from "./Context/PermissionsContext";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <AuthProvider>
        <PermissionsProvider userId={user?.id}>
          <RouteNavigation />
        </PermissionsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
