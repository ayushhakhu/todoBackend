const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();

const ToDoContoller = require("../controllers/ToDoController");
const isAuth = require("../middleware/isAuth");

router.get("/count", isAuth, ToDoContoller.getTodosCount);

router.get("/", isAuth, ToDoContoller.fetchAllToDos);

router.post(
  "/",
  [body("todoItem").isLength({ min: 3, max: 15 })],
  isAuth,
  ToDoContoller.createToDo
);

router.delete("/:postId", isAuth, ToDoContoller.deleteToDo);

router.put(
  "/:postId",
  [body("todoItem").isLength({ min: 3, max: 15 })],
  isAuth,
  ToDoContoller.updateToDo
);

module.exports = router;
