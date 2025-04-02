const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Register User
const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await prisma.user.findUnique({ where: { username } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(201).json({
      id: user.id,
      name: user.username,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        message: "Logged in successfully",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Details
const getUser = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(401).json({ message: "Not authorized", error: error.message });
  }
};

module.exports = { register, login, getUser };
