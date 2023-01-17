const express = require("express");
const { Post } = require("../models/Post");
const router = express.Router();

const {
  getAllPosts,
  getPostByID,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
} = require("./PostFunctions");

// Get all Posts
// [GET] /posts
router.get("/", async (request, response) => {
  const allPosts = await getAllPosts();

  return response.json({
    count: allPosts.length,
    data: allPosts,
  });
});

module.exports = router;
