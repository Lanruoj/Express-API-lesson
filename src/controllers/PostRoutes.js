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
  const allPosts = getAllPosts();

  return allPosts;
});
