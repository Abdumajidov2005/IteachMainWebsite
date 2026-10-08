import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import Admin from "./components/Admin/Admin";

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

  // role === "user" — hozircha vaqtinchalik xabar,
  // keyingi qadamda bu yerga Iteach saytini qo'shamiz
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f8f7]">
      <div className="text-center">
        <p className="text-lg font-bold">Xush kelibsiz! (User rejimi)</p>
        <p className="mt-2 text-sm text-gray-500">
          Bu yerga Iteach sayti keyingi qadamda qo'shiladi
        </p>
        <button
          onClick={handleLogout}
          className="mt-4 rounded-xl bg-[#111816] px-5 py-2.5 text-sm font-bold text-white"
        >
          Chiqish
        </button>
      </div>
    </div>
  );
}