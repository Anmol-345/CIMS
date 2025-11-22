const express = require("express");
const router = express.Router();
const StudentController = require("../controllers/studentController");
const Auth = require("../middlewares/auth");

// Public routes
router.post("/register", StudentController.register);
router.post("/login", StudentController.login);

// Authenticated routes
// Get own info
router.get("/me", new Auth(["student", "admin"]).handle, StudentController.getMe);

// Update own fee status (student only)
router.patch("/fees", new Auth(["student"]).handle, StudentController.updateFeeStatus);

router.get("/logout", new Auth(["student", "admin"]).handle, StudentController.logout);

// // Admin updating marks (admin only)
// router.patch("/:id/marks", new Auth(["admin"]).handle, StudentController.updateMarks);

module.exports = router;
