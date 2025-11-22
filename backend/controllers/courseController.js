const Course = require("../models/course");
const Student = require("../models/student");

// GET all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching courses",
      error: error.message,
    });
  }
};

// GET single course
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching course",
      error: error.message,
    });
  }
};

// ADD course
exports.addCourse = async (req, res) => {
  const { name, code, level, fee } = req.body;
  try {
    const course = await Course.create({ name, code, level, fee });
    return res.status(201).json({
      message: "Course added successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while posting course",
      error: error.message,
    });
  }
};

// UPDATE course
exports.updateCourse = async (req, res) => {
  const { name, code, level, fee } = req.body;
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code, level, fee },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while updating course",
      error: error.message,
    });
  }
};

// DELETE course
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Student.updateMany(
      {},
      { $pull: { courses: { course: courseId } } }
    );

    return res.status(200).json({
      message: "Course deleted and removed from student records",
      deletedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting course",
      error: error.message,
    });
  }
};
