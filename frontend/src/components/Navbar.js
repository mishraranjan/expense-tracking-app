// src/components/Navbar.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 w-full p-4 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-xl">Expense Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="mr-4 hidden lg:block md:block">Welcome, {username}!</span>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
