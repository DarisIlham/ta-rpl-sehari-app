// middleware/validateTaskStatusOnly.js
import { body, validationResult } from "express-validator";

const validateTaskStatusOnly = [
  body("status")
    .notEmpty()
    .isIn(["Upcoming", "Ongoing", "Complete"])
    .withMessage("Invalid status"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateTaskStatusOnly;
