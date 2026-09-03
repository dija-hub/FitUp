import "./App.css";
import Web from "./Web";
import { useState } from "react";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  return  (
  <Web
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      showDashboard={showDashboard}
      setShowDashboard={setShowDashboard}
    />
  )
}

export default App;