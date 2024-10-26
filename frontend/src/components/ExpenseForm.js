// ExpenseForm.js
import React, { useState } from 'react';
import axios from 'axios';

function ExpenseForm({ onExpenseAdded }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `https://expense-tracking-backend-oht2.onrender.com/api/expenses/add`,
        { amount, description, date },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true } // Include credentials if needed
      );
      onExpenseAdded(response.data);
      setAmount('');
      setDescription('');
      setDate('');
    } catch (error) {
      console.error('Failed to add expense', error);
      alert('Error adding expense');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2">Add Expense</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="mb-2 p-2 w-full border rounded"
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-2 p-2 w-full border rounded"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-2 p-2 w-full border rounded"
        required
      />
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">
        Add Expense
      </button>
    </form>
  );
}

export default ExpenseForm;
