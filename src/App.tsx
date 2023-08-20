import { Route, Routes } from "react-router-dom";
import MainScreen from "./pages/main-screen";
import Sandbox from "./pages/sandbox";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainScreen />} />
      <Route path="/sandbox" element={<Sandbox />} />
    </Routes>
  );
}

export default App;
