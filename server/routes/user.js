const express = require('express');
const router = express.Router();

const {loginUser, signupUser, updateUser, getUser} = require("../controllers/userController");
const {changePassword,forgotPassword} = require("../controllers/resetPassword");

//login route
router.post("/login", loginUser);

//sign up route
router.post("/signup", signupUser);

//update route
router.patch("/:id", updateUser);

//get route
router.get("/:id", getUser)

//forgot password route
router.post("/forgot-password", forgotPassword);

//reset password route
router.post("/reset/:resetPasswordToken", changePassword);

module.exports = router;