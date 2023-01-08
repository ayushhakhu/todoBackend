const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const cors = require("cors");

const todoItemsRoutes = require("./routes/todoItems");
const userRoutes = require("./routes/user");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use("/posts", todoItemsRoutes);
app.use("/auth", userRoutes);

app.use((err, req, res, next) => {
  res
    .status(500)
    .json({ message: `Something went wrong due to error - ${err}` });
});

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

mongoose
  .connect(
    "mongodb+srv://test:yJMyEQ9XOS7Xck6l@cluster0.1aacova.mongodb.net/ToDoItems"
  )
  .then((_) => {
    app.listen(8000, () => {
      console.log("Listening on Port 3000");
    });
  })
  .catch((err) => console.log("Unable to connect to DB"));
