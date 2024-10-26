const express = require('express');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Add expense
router.post('/add', authMiddleware, async (req, res) => {
  const { amount, description, date } = req.body;
  const expense = new Expense({
    userId: req.user.id,
    amount,
    description,
    date,
  });
  await expense.save();
  res.json(expense);
});

// Get all expenses for a user
router.get('/all', authMiddleware, async (req, res) => {
  const expenses = await Expense.find({ userId: req.user.id });
  res.json(expenses);
});

// Delete expense
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await Expense.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit expense
router.put('/edit/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { amount, description, date } = req.body;
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { amount, description, date },
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
