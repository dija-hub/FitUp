import { useState } from "react";
import Web from "./Web";
import Dashboard from "./dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  if (showDashboard && isLoggedIn) {
    return (
      <Dashboard
        setIsLoggedIn={setIsLoggedIn}
        setShowDashboard={setShowDashboard}
      />
    );
  }

  return (
    <Web
      setIsLoggedIn={setIsLoggedIn}
      setShowDashboard={setShowDashboard}
    />
  );
}

export default App;