const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth");
const courseController = require("../controllers/courseController");

// GET all courses
router.get("/", courseController.getAllCourses);

// GET single course (admin only)
router.get("/:id", new Auth(["admin"]).handle, courseController.getCourseById);

// ADD course (admin only)
router.post("/add", new Auth(["admin"]).handle, courseController.addCourse);

// UPDATE course (admin only)
router.put("/update/:id", new Auth(["admin"]).handle, courseController.updateCourse);

// DELETE course (admin only)
router.delete("/delete/:id", new Auth(["admin"]).handle, courseController.deleteCourse);

module.exports = router;
