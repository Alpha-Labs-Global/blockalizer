import { Route, Routes } from "react-router-dom";
import MainScreen from "./pages/MainScreen";
import Sandbox from "./pages/Sandbox";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainScreen />} />
      <Route path="/sandbox" element={<Sandbox />} />
    </Routes>
  );
}

export default App;
