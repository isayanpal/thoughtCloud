const express = require('express');
const verifyToken = require('../middlewares/auth');
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/post');
const router = express.Router();

router.post("/", verifyToken,createPost);
router.get("/",getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;