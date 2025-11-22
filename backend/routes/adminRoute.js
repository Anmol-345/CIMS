const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const Auth = require("../middlewares/auth");

// Public route
router.post("/login", AdminController.login);

// Admin-only routes
router.get("/students", new Auth(["admin"]).handle, AdminController.getAllStudents);

router.get("/students/:id", new Auth(["admin"]).handle, AdminController.getStudentById);

router.patch("/students/:id", new Auth(["admin"]).handle, AdminController.updateStudent);

router.delete("/students/:id", new Auth(["admin"]).handle, AdminController.deleteStudent);

router.patch(
  "/students/:id/approve",
  new Auth(["admin"]).handle,
  AdminController.approveStudent
);

router.patch(
  "/students/:id/reject",
  new Auth(["admin"]).handle,
  AdminController.rejectStudent
);

router.get("/me", new Auth(["admin"]).handle, AdminController.getAdminProfile);

router.get("/logout", new Auth(["admin"]).handle, AdminController.logout);

module.exports = router;
