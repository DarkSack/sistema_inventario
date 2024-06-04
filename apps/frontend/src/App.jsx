import "./App.css";
import "@mantine/core/styles.css";
import { AuthProvider } from "./Context/AuthContext";
import { RouteNavigation } from "./Context/Routes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthProvider>
        <RouteNavigation />
      </AuthProvider>
    </Router>
  );
}

export default App;
