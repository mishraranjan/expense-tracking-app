// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ExpenseForm from "../components/ExpenseForm"; // Adjust the path if necessary
import Navbar from "../components/Navbar"; // Adjust the path if necessary
import TransactionHistory from "../components/TransactionHistory"; // Import TransactionHistory component

// Register the Chart.js components
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
  const [expenses, setExpenses] = useState([]); // State to hold expenses
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await axios.get("https://expense-tracking-backend-oht2.onrender.com/api/auth/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIncome(userResponse.data.income);
        setUsername(userResponse.data.username); // Set username from user response

        // Fetch all expenses
        const expenseResponse = await axios.get("https://expense-tracking-backend-oht2.onrender.com/api/expenses/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setExpenses(expenseResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchData();
  }, []);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  // Calculate balance
  const balance = income - totalExpenses;

  // Handle new expense added
  const handleExpenseAdded = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  // Handle expense updated
  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense._id === updatedExpense._id ? updatedExpense : expense
      )
    );
  };

  // Handle expense deleted
  const handleExpenseDeleted = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense._id !== id)
    );
  };

  const chartData = {
    labels: ["Income", "Balance", "Expenses"], // Add 'Balance' label
    datasets: [
      {
        label: "Amount",
        data: [income, balance, totalExpenses], // Include balance in data
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)", // Income color
          "rgba(153, 102, 255, 0.6)", // Balance color
          "rgba(255, 99, 132, 0.6)", // Expenses color
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", // Income border color
          "rgba(153, 102, 255, 1)", // Balance border color
          "rgba(255, 99, 132, 1)", // Expenses border color
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Navbar username={username} />
      <div className="max-w-4xl mx-auto p-4">
        {/* Greeting message - hidden on small screens */}
        <h2 className="text-xl font-semibold mt-4">
          Dashboard
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-gray-50 p-4 rounded shadow-md mt-4">
            <Bar data={chartData} />
            {/* Pass the onExpenseAdded prop to ExpenseForm */}
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            {/* Pass props to TransactionHistory */}
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
