// Dashboard.js
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
import ExpenseForm from "../components/ExpenseForm"; 
import Navbar from "../components/Navbar";
import TransactionHistory from "../components/TransactionHistory"; 

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
  const [expenses, setExpenses] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true, // Include credentials if needed
        });
        setIncome(userResponse.data.income);
        setUsername(userResponse.data.username); 

        const expenseResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true, // Include credentials if needed
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

  const handleExpenseAdded = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense._id === updatedExpense._id ? updatedExpense : expense
      )
    );
  };

  const handleExpenseDeleted = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense._id !== id)
    );
  };

  const chartData = {
    labels: ["Income", "Balance", "Expenses"], 
    datasets: [
      {
        label: "Amount",
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
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-xl font-semibold mt-4">
          Dashboard
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-gray-50 p-4 rounded shadow-md mt-4">
            <Bar data={chartData} />
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
