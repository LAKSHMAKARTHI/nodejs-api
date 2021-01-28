const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth');
const authenticate = require('../../middleware/authenticate');

router.post("/register", AuthController.register);
router.post("/phone_verify", AuthController.phoneVerification);
router.post("/login", AuthController.login);
//router.post("/forgot_pass", AuthController);
//router.post("/fg_new_password", AuthController);

module.exports = router;