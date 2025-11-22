const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const Auth = require("../middlewares/auth");

// Public route
router.post("/login", (req, res) => AdminController.login(req, res));

// Admin-only routes
router.get("/students", new Auth(["admin"]).handle, (req, res) =>
  AdminController.getAllStudents(req, res)
);

router.get("/students/:id", new Auth(["admin"]).handle, (req, res) =>
  AdminController.getStudentById(req, res)
);

router.patch("/students/:id", new Auth(["admin"]).handle, (req, res) =>
  AdminController.updateStudent(req, res)
);

router.delete("/students/:id", new Auth(["admin"]).handle, (req, res) =>
  AdminController.deleteStudent(req, res)
);

router.patch(
  "/students/:id/approve",
  new Auth(["admin"]).handle,
  AdminController.approveStudent
);

router.delete(
  "/students/:id/reject",
  new Auth(["admin"]).handle,
  AdminController.rejectStudent
);

router.get("/me", new Auth(["admin"]).handle, AdminController.getAdminProfile);

router.get("/logout", new Auth(["admin"]).handle, AdminController.logout);

module.exports = router;
