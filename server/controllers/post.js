const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const fs = require("fs");

const prisma = new PrismaClient();

const uploadMiddleware = multer({ dest: "uploads/" });

const createPost = async (req, res) => {
  uploadMiddleware.single("image")(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const { title, content, authorId } = req.body;

      if (!authorId) {
        return res.status(401).json({ message: "Unauthorized: No user ID found" });
      }

      let imagePath = null;
      if (req.file) {
        const { originalname, path: tempPath } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const newPath = tempPath + "." + ext;

        fs.renameSync(tempPath, newPath);
        imagePath = newPath;
      }

      const post = await prisma.post.create({
        data: { title, content, image: imagePath, authorId },
      });

      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

//get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get post by id
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update post by id
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const image = req.file ? req.file.path : null;

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (existingPost.authorId !== req.userId) {
      return res.status(403).json({ message: "Forbidden: Not your post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title || existingPost.title,
        content: content || existingPost.content,
        image: image || existingPost.image,
      },
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete post by id
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== req.userId) {
      return res.status(403).json({ message: "Forbidden: Not your post" });
    }

    await prisma.post.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
