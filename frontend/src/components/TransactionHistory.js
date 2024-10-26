// TransactionHistory.js
import React, { useState } from 'react';
import axios from 'axios';

const TransactionHistory = ({ expenses, onExpenseUpdated, onExpenseDeleted }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');

  const filteredExpenses = expenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setAmount(expense.amount);
    setDescription(expense.description);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`https://expense-tracking-backend-oht2.onrender.com/api/expenses/edit/${selectedExpense._id}`, {
        amount,
        description,
        date: selectedExpense.date,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true // Include credentials if needed
      });

      // Call the onExpenseUpdated callback with the updated expense
      onExpenseUpdated(response.data);
      setSelectedExpense(null); // Close modal
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://expense-tracking-backend-oht2.onrender.com/api/expenses/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true // Include credentials if needed
      });
      // Call the onExpenseDeleted callback
      onExpenseDeleted(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mt-4">
      <h2 className="text-xl font-bold mb-2">Transaction History</h2>
      <input
        type="text"
        placeholder="Search by description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 w-full border rounded"
      />
      <ul className="mb-4">
        {filteredExpenses.map((expense) => (
          <li key={expense._id} className="flex justify-between items-center mb-2">
            <span>{expense.description}: ${expense.amount}</span>
            <div>
              <button 
                onClick={() => handleEdit(expense)} 
                className="mr-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(expense._id)} 
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {selectedExpense && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Edit Expense</h3>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-2 p-2 w-full border rounded"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2 p-2 w-full border rounded"
          />
          <button 
            onClick={handleUpdate} 
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
