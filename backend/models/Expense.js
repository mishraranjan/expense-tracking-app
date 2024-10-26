const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Expense', ExpenseSchema);
