import "./App.css";
import "@mantine/core/styles.css";
import { TopBar } from "./View/TopBar";
import { AuthContextProvider } from "./AuthContext";

function App() {
  return (
    <AuthContextProvider>
      <TopBar />
    </AuthContextProvider>
  );
}

export default App;
