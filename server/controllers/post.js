const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

const uploadMiddleware = multer({ dest: "uploads/" });

// create post
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

      let imageName = null;
      if (req.file) {
        const { originalname, path: tempPath } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const uniqueFilename = `${uuidv4()}.${ext}`;
        const newPath = path.join(__dirname, "..", "uploads", uniqueFilename);

        fs.renameSync(tempPath, newPath);
        imageName = uniqueFilename;
      }

      let imageUrl = null;
      if (imageName) {
        const serverBaseUrl = process.env.SERVER_URL || "http://localhost:5000";
        imageUrl = `${serverBaseUrl}/uploads/${imageName}`;
      }

      const post = await prisma.post.create({
        data: { title, content, image: imageName, authorId },
      });

      res.status(201).json({ ...post, imageUrl });
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

    const serverBaseUrl = process.env.SERVER_URL || "http://localhost:5000";

    const transformedPosts = posts.map((post) => ({
      ...post,
      imageUrl: post.image ? `${serverBaseUrl}/uploads/${post.image}` : null,
    }));

    res.status(200).json(transformedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
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

    const serverBaseUrl = process.env.SERVER_URL || "http://localhost:5000";
    const imageUrl = post.image ? `${serverBaseUrl}/uploads/${post.image}` : null;

    res.status(200).json({ ...post, imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update post by id
const updatePost = async (req, res) => {
  uploadMiddleware.single("image")(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const userId = req.user.id;

      const existingPost = await prisma.post.findUnique({ where: { id } });
      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (existingPost.authorId !== userId) {
        return res.status(403).json({ message: "Forbidden: Not your post" });
      }

      let imageName = existingPost.image;
      if (req.file) {
        if (existingPost.image) {
          const oldImagePath = path.join(__dirname, "..", "uploads", existingPost.image);
          try {
            fs.unlinkSync(oldImagePath);
          } catch (unlinkError) {
            console.error("Error deleting old image:", unlinkError);
          }
        }

        const { originalname, path: tempPath } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        const uniqueFilename = `${uuidv4()}.${ext}`;
        const newPath = path.join(__dirname, "..", "uploads", uniqueFilename);

        fs.renameSync(tempPath, newPath);
        imageName = uniqueFilename;
      }

      const updatedPost = await prisma.post.update({
        where: { id },
        data: {
          title: title || existingPost.title,
          content: content || existingPost.content,
          image: imageName,
        },
      });

      const serverBaseUrl = process.env.SERVER_URL || "http://localhost:5000";
      const imageUrl = imageName ? `${serverBaseUrl}/uploads/${imageName}` : null;

      res.status(200).json({ ...updatedPost, imageUrl });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

//delete post by id
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const postInfo = await prisma.post.findUnique({ where: { id } });

    if (!postInfo) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (postInfo.authorId !== userId) {
      return res.status(403).json({ message: "Forbidden: Not your post" });
    }

    if (postInfo.image) {
      const imageToDeletePath = path.join(__dirname, "..", "uploads", postInfo.image);
      try {
        fs.unlinkSync(imageToDeletePath);
      } catch (unlinkError) {
        console.error("Error deleting image:", unlinkError);
      }
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