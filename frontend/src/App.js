// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import PrivateRoute from './components/PrivateRoute'; // Assuming this is still being used for protecting routes

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
          <Route path="/transactions" element={<PrivateRoute component={TransactionHistory} />} />
          <Route path="/" element={<Login />} /> {/* Redirect to login or home */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
