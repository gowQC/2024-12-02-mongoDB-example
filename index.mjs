import db from "./db/conn.mjs";
import express from "express";
import dotenv from "dotenv";

console.log("logged");
dotenv.config();

// using grades.mjs for my routes by importing file
// then I need to use those grades routes for anything matching /api/grades
import grades from "./routes/grades.mjs";

// process.env is what allows me to access the .env file
// PORT is what is was called in the .env file
// either successfully access PORT from .env OR set PORT to 5050
const PORT = process.env.PORT || 5050;
const app = express();

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send(
    "Welcome to the API! Documentation could go here, or you can redirect to documentation."
  );
});

app.use("/api/grades", grades);

// Global error handling after routes
app.use((err, _req, res, next) => {
  res.status(500).send("Seems like we messed up somewhere.");
});

// start the express application
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
