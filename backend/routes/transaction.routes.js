import { Router } from "express";
const router = Router();
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  getSpendFrequency,
} from "../controllers/transaction.controller.js";
import validateTransaction from "../middleware/validate.transaction.js";
import { verifyToken } from "../middleware/auth.middleware.js";

//Ambil semua transaksi
router.get("/", verifyToken, getTransactions);

//Tambah transaksi baru
router.post("/", verifyToken, validateTransaction, createTransaction);

//Update transaksi
router.put("/:id", verifyToken, validateTransaction, updateTransaction);

//Hapus transaksi
router.delete("/:id", verifyToken, deleteTransaction);

//total income, expense, balance
router.get("/summary", verifyToken, getSummary);

// grafik pengeluaran
router.get("/spend-frequency", verifyToken, getSpendFrequency);

export default router;
