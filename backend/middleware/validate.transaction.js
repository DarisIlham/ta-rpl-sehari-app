import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

const validateTransaction = [
  body("type")
    .isIn(["income", "expense"])
    .withMessage("Type must be 'income' or 'expense'"),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0"),

  body("category").notEmpty().withMessage("Category is required"),

  body("date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Date must be a valid ISO date"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateTransaction;
