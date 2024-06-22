// src/App.jsx
import "./App.css";
import "@mantine/core/styles.css";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import { RouteNavigation } from "./Context/Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { PermissionsProvider } from "./Context/PermissionsContext";

function AppContent() {
  const { user } = useAuth();

  return (
    <PermissionsProvider userId={user?.id}>
      <RouteNavigation />
    </PermissionsProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
