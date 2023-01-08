const mongoose = require("mongoose");

const ToDoSchema = new mongoose.Schema(
  {
    todoItem: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("ToDo", ToDoSchema);
