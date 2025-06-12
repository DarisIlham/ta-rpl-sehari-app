import mongoose from "mongoose";
import { Schema } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

// Pass mongoose to plugin
const AutoIncrement = AutoIncrementFactory(mongoose);

const taskSchema = new Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ["Work", "Personal", "Me Time", "Project"], // Match frontend
      required: true,
    },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Complete"], // Match frontend
      default: "Upcoming",
      required: true,
    },
    section: {
      type: String,
      enum: ["General Tasks", "My Schedule", "Work", "Important"], // Match frontend
      default: "General Tasks",
      required: true,
    },
    color: {
      type: String,
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Add auto-increment plugin here
taskSchema.plugin(AutoIncrement, {
  inc_field: "task_id", // the auto-increment field name
  start_seq: 1, // optional: start from 1
});

export default mongoose.model("Task", taskSchema);
