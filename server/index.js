const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const authRoutes = require("./routes/user");

dotenv.config();

const app = express();
app.use(cors);
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

const PORT = 5000;
app.listen(() => {
  console.log(`Server running on port: ${PORT}`);
});
