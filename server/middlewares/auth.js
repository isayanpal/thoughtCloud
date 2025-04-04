const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client"); // Assuming you need Prisma here

const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Failed to authenticate token", error: err.message });
  }
};

module.exports = verifyToken;