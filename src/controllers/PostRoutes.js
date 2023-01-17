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

// Get Post by provided ID
// [GET] /posts/:postID
router.get("/:postID", async (request, response) => {
  const post = await getPostByID(request.params.postID);

  return response.json(post);
});

// Get Post by author ID
// [GET] /posts/:authorID
router.get("/:authorID", async (request, response) => {
  const post = await getPostsByAuthor(request.params.authorID);

  return response.json(post);
});

// Create a new Post
// [POST] /posts
router.post("/", async (request, response) => {
  const newPost = await createPost(request.body.postDetails);

  return response.json(newPost);
});

// Update a Post
// [PUT] /posts/:postID
router.put("/:postID", async (request, response) => {
  const postDetails = {
    postID: request.params.postID,
    updateData: request.body.updateData,
  };
  const updatedPost = await updatePost(postDetails);

  return response.json(updatedPost);
});

// Delete a Post
// [DELETE] /posts/:postID
router.delete("/:postID", async (request, response) => {
  const deletedPost = await deletePost(request.params.postID);

  return response.json(deletedPost);
});

module.exports = router;
