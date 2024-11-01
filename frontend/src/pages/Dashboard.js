// Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ExpenseForm from "../components/ExpenseForm"; 
import Navbar from "../components/Navbar";
import TransactionHistory from "../components/TransactionHistory"; 
import { BACKEND_URL } from '../constant'; // Import the BACKEND_URL constant

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [income, setIncome] = useState(0);
  const [newIncome, setNewIncome] = useState(income);
  const [expenses, setExpenses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${BACKEND_URL}/api/auth/user`, { // Use BACKEND_URL here
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true, 
        });

        setIncome(Number(userResponse.data.income));
        setNewIncome(Number(userResponse.data.income)); 
        setUsername(userResponse.data.username); 

        const expenseResponse = await axios.get(`${BACKEND_URL}/api/expenses/all`, { // Use BACKEND_URL here
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        setExpenses(expenseResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = income - totalExpenses;

  const handleIncomeUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${BACKEND_URL}/api/auth/updateIncome`, // Use BACKEND_URL here
        { income: newIncome }, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      setIncome(Number(newIncome));
      toast("Income updated successfully!");
    } catch (error) {
      console.error("Failed to update income:", error);
      toast.error("Failed to update income. Please try again.");
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    toast("Expense added successfully!"); 
  };

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense._id === updatedExpense._id ? updatedExpense : expense
      )
    );
    toast("Expense updated successfully!"); 
  };

  const handleExpenseDeleted = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense._id !== id)
    );
    toast("Expense deleted successfully!");
  };

  const chartData = {
    labels: ["Income", "Balance", "Expenses"], 
    datasets: [
      {
        label: "Expense-Map",
        data: [income, balance, totalExpenses], 
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", 
          "rgba(153, 102, 255, 0.6)", 
          "rgba(255, 99, 132, 0.6)", 
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", 
          "rgba(153, 102, 255, 1)", 
          "rgba(255, 99, 132, 1)", 
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Navbar username={username} />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-semibold mt-4">Dashboard</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-gray-50 p-4 rounded shadow-md mt-4 ">
            <Bar data={chartData} />
            <div className="flex flex-row justify-between mt-6 p-4 bg-white rounded shadow-sm border">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">Income</h3>
                <p className="text-xl font-bold text-green-500">₹{income.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
                <p className="text-xl font-bold text-blue-500">₹{balance.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700">Expenses</h3>
                <p className="text-xl font-bold text-red-500">₹{totalExpenses.toFixed(2)}</p>
              </div>
            </div>
            <form onSubmit={handleIncomeUpdate} className="mt-4">
              <input
                type="number"
                value={newIncome}
                onChange={(e) => setNewIncome(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
                placeholder="Update Income"
              />
              <button
                type="submit"
                className="w-full p-2 bg-blue-500 text-white rounded"
              >
                Update Income
              </button>
            </form>
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            <TransactionHistory 
              expenses={expenses} 
              onExpenseUpdated={handleExpenseUpdated}
              onExpenseDeleted={handleExpenseDeleted}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
