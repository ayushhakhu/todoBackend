const ToDoModel = require("../models/ToDoModel");
const UserModel = require("../models/UserModel");

const { validationResult } = require("express-validator/check");

const MAX_TODOS = 2;

exports.fetchAllToDos = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { page } = req.query;

    const foundUser = await UserModel.findOne({ email: req.email });

    const fetchedToDos = await ToDoModel.find({ createdBy: foundUser._id })
      .limit(MAX_TODOS)
      .skip((page - 1) * MAX_TODOS);

    if (fetchedToDos) {
      res.status(200).json(fetchedToDos);
    } else {
      res.status(200).json({ message: "No To Dos Exist" });
    }
  } else {
    next(errors);
  }
};

exports.createToDo = async (req, res, next) => {
  const { todoItem } = req.body;

  const foundUser = await UserModel.findOne({ email: req.email });

  try {
    const newToDo = new ToDoModel({
      todoItem: todoItem,
      createdBy: foundUser._id,
    });
    await newToDo.save();
    res.status(201).json({ message: "Created New Post" });
  } catch (error) {
    next(errors);
  }
};

exports.deleteToDo = async (req, res, next) => {
  const { postId } = req.params;
  const userDetails = await UserModel.findOne({ email: req.email });
  const postDetails = await ToDoModel.findById(postId);
  if (userDetails.id == postDetails.createdBy) {
    await ToDoModel.findByIdAndDelete(postId);
    res.status(200).json({ message: `deleted object entry - ${postId}` });
  } else {
    res
      .status(422)
      .json({ message: `No allowed to delete object entry - ${postId}` });
  }
};

exports.updateToDo = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { postId } = req.params;
    const { todoItem } = req.body;
    const userDetails = await UserModel.findOne({ email: req.email });
    const postDetails = await ToDoModel.findById(postId);
    if (userDetails.id == postDetails.createdBy) {
      const newData = await ToDoModel.findByIdAndUpdate(postId, {
        todoItem: todoItem,
      });
      newData.save();
      res.status(200).json({ message: `Updated object entry - ${postId}` });
    } else {
      res
        .status(422)
        .json({ message: `${postId} does not belongs to the user` });
    }
  } else {
    next(errors);
  }
};

exports.getTodosCount = async (req, res, next) => {
  const userDetails = await UserModel.find({ email: req.email });

  const count = await ToDoModel.find({ createdBy: userDetails[0]._id });
  res.status(200).json({ count: count.length });
};
