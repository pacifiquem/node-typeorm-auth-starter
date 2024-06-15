require("dotenv").config();
require("reflect-metadata");
const express = require("express");
const morgan = require("morgan");

const cors = require("cors");
const AppDataSource = require("./db/dataSource");
const userController = require("./controllers/userController");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const port = process.env.PORT || 2500;

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Routes
app.post("/signup", userController.signUp);
app.post("/login", userController.login);

// Protected Routes ... but them below the auth middleware
app.use(authMiddleware);
app.get("/me", userController.getLoggedInUser);

// Initialize TypeORM Data Source
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source <Database Connection> has been initialized!");

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
