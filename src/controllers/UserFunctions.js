const { User } = require("../models/User");

const dotenv = require("dotenv");
dotenv.config();

// Encryption/decryption configuration
const crypto = require("crypto");
const encAlgorithm = "aes-256-cbc";
const encPrivateKey = crypto.scryptSync(process.env.ENC_KEY, "SpecialSalt", 32);
const encIV = crypto.scryptSync(process.env.ENC_IV, "SpecialSalt, 16");
let cipher = crypto.createCipheriv(encAlgorithm, encPrivateKey, encIV);
let decipher = crypto.createDecipheriv(encAlgorithm, encPrivateKey, encIV);

//// Encryption & decryption functionality

// Encrypt a string
function encryptString(data) {
  cipher = crypto.createCipheriv(encAlgorithm, encPrivateKey, encIV);
  return cipher.update(data, "utf8", "hex") + cipher.final("hex");
}

// Decrypt a string
function decryptString(data) {
  decipher = crypto.createDecipheriv(encAlgorithm, encPrivateKey, encIV);
  return decipher.update(data, "hex", "utf8") + decipher.final("utf8");
}

// Decrypts a stringified JSON object and converts to regular object
function decryptObject(data) {
  return JSON.parse(decryptString(data));
}

//// Hashing & Salting functionality
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Hash a string
async function hashString(stringToHash) {
  let saltToAdd = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(stringToHash, saltToAdd);
}

// Validate hashed data
async function validateHashedData(providedUnhashedData, storedHashedData) {
  return await bcrypt.compare(providedUnhashedData, storedHashedData);
}

//// JWT functionality

const jwt = require("jsonwebtoken");

// Generate a JWT from payload
function generateJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
}

// Generate JWT from encrypted User data with provided User details
async function generateUserJWT(userDetails) {
  // Encrypt the User payload
  let encryptedUserData = encryptString(JSON.stringify(userDetails));
  // Must pass an object to create JWT otherwise expiresIn won't work
  return generateJWT({ data: encryptedUserData });
}

// Verify a User's JWT and refresh
async function verifyUserJWT(userJWT) {
  // Verify JWT is valid
  const verifiedJWT = jwt.verify(userJWT, process.env.JWT_SECRET_KEY, {
    complete: true,
  });
  // Decrypt JWT payload
  const decryptedJWT = decryptString(verifiedJWT.payload.data);
  // Parse decrypted data into an object
  const userData = JSON.parse(decryptedJWT);
  // Find User from data
  const targetUser = await User.findById(userData.userID).exec();
  // Check that JWT data matches stored data
  if (
    targetUser.password == userData.password &&
    targetUser.email == userData.email
  ) {
    return generateJWT({ data: verifiedJWT.payload.data });
  } else {
    throw new Error({ message: "Invalid user token" });
  }
}
