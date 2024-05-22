import "./App.css";
import "@mantine/core/styles.css";
import { AuthContextProvider } from "./Context/AuthContext";
import { RouteNavigation } from "./Context/Routes";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <AuthContextProvider>
        <RouteNavigation />
      </AuthContextProvider>
    </Router>
  );
}

export default App;
