import { Router } from "express";
const router = Router();
import Transaction from "../models/transaction.model.js";

router.get("/stats", async (req, res) => {
  try {
    const user_id = Number(req.body.user_id); // pastikan bentuknya sesuai
    if (!user_id) {
      return res.status(400).json({ error: "user_id is required as query param" });
    }

    const stats = await Transaction.aggregate([
      { $match: { user_id } }, // filter berdasarkan user
      {
        $group: {
          _id: {
            category: "$category",
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          type: "$_id.type",
          total: 1,
        },
      },
      {
        $sort: { category: 1, type: 1 } // opsional: urutkan hasil
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate statistics." });
  }
});


export default router;
