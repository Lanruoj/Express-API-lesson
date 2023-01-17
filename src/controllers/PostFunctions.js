const { request } = require("express");
const { Post } = require("../models/Post");

// Get all Posts
async function getAllPosts() {
  const allPosts = await Post.find({}).exec();

  return allPosts;
}

// Get Post with provided ID
async function getPostByID(postID) {
  const post = await Post.findById(postID).exec();

  return post;
}

// Get Posts by author (User)
async function getPostsByAuthor(userID) {
  const posts = await Post.find({ author: userID }).exec();

  return posts;
}

// Create new Post
async function createPost(postDetails) {
  const newPost = Post.create(postDetails);

  return newPost;
}

// Update Post
async function updatePost(postDetails) {
  const updatedPost = await Post.findByIdAndUpdate(
    postDetails.id,
    postDetails.updatedData,
    { returnDocument: "after" }
  ).exec();

  return updatedPost;
}

// Delete Post
async function deletePost(postID) {
  const deletedPost = await Post.findByIdAndDelete(postID).exec();

  return deletedPost;
}

module.exports = {
  getAllPosts,
  getPostByID,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost,
};
