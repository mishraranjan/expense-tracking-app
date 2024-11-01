import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify"; 
import BACKEND_URL from '../constant/url';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, { // Use BACKEND_URL here
        username,
        password,
      }, { withCredentials: true }); 
      localStorage.setItem('token', response.data.token);
      toast.success(`${username} logged in successfully!`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); 
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Invalid username or password'); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={2000} />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full border rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to={"/register"} className="text-blue-500">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
