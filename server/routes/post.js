const express = require('express');
const verifyToken = require('../middlewares/auth');
const upload = require('../middlewares/multer');
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/post');
const router = express.Router();

router.post("/", verifyToken, upload.single("image"),createPost);
router.get("/",getAllPosts);
router.get("/:id", getPostById);
router.put("/:id", verifyToken, upload.single("image"), updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;