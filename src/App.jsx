import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import Admin from "./components/Admin/Admin";
import Landing from "./components/Landing/Landing";

export default function App() {
  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  if (!role) {
    return <Login onLogin={handleLogin} />;
  }

  if (role === "admin") {
    return <Admin onLogout={handleLogout} />;
  }

  // role === "user" — iTeach landing sahifasi
  return <Landing onLogout={handleLogout} />;
}