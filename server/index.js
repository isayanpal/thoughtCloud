const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

dotenv.config();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.VITE_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
