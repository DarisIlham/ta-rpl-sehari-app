import { body, validationResult } from "express-validator";
import mongoose from "mongoose";

const validateTask = [
  body("name")
    .notEmpty()
    .withMessage("Task name is required"),

  body("time")
    .isISO8601()
    .toDate()
    .withMessage("Time must be a valid ISO date"),

  body("category")
    .isIn(["Work", "Personal", "Me Time", "Project"])
    .withMessage("Invalid category"),

  body("status")
  .optional()
  .isIn(["Upcoming", "Ongoing", "Complete"])
  .withMessage("Status must be 'not started', 'in progress', or 'completed'"),

   body("section")
    .optional()
    .isIn(["General Tasks", "My Schedule", "Work", "Important"])
    .withMessage("Invalid section"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateTask;