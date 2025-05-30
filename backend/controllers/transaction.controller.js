import Transaction from "../models/transaction.model.js";

// Create a new transaction
export async function createTransaction(req, res) {
  try {
    const transaction = new Transaction({
      ...req.body,
      user_id: req.user.user_id, // Use the authenticated user's ID
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to create transaction." });
  }
}

// Get all transactions for the authenticated user
export async function getTransactions(req, res) {
  try {
    const transactions = await Transaction.find({
      user_id: req.user.user_id,
    }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions." });
  }
}

// Update a transaction by ID
export async function updateTransaction(req, res) {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      {
        transaction_id: req.params.id,
        user_id: req.user.user_id, // Ensure user owns the transaction
      },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found." });
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: "Failed to update transaction." });
  }
}

// Delete a transaction by ID
export async function deleteTransaction(req, res) {
  try {
    const deleted = await Transaction.findOneAndDelete({
      transaction_id: req.params.id,
      user_id: req.user.user_id, // Ensure user owns the transaction
    });

    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found." });
    }
    res.json({ message: "Transaction deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete transaction." });
  }
}

// Get income, expense, and balance summary
export async function getSummary(req, res) {
  try {
    const [income] = await Transaction.aggregate([
      { $match: { user_id: req.user.user_id, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const [expense] = await Transaction.aggregate([
      { $match: { user_id: req.user.user_id, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.json({
      totalIncome: income?.total || 0,
      totalExpense: expense?.total || 0,
      balance: (income?.total || 0) - (expense?.total || 0),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary." });
  }
}

// Get spending frequency (e.g., total expense per day)
export async function getSpendFrequency(req, res) {
  try {
    const result = await Transaction.aggregate([
      {
        $match: {
          user_id: req.user.user_id,
          type: "expense",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(
      result.map((item) => ({
        date: item._id,
        total: item.total,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch spend frequency." });
  }
}
