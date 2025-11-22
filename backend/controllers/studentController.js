const Student = require("../models/student");
const Course = require("../models/course");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register student
exports.register = async (req, res) => {
  try {
    const { name, email, password, courses } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const coursesWithMarks = courses.map(c => ({
      course: c,
      marks: null,
      feePaid: false,
    }));

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      courses: coursesWithMarks,
      accountStatus: "pending",
      role: "student",
      level: req.body.level
    });

    res.status(201).json({ message: "Registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login student
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: student._id, role: student.role, email: student.email, name: student.name, path: student.level },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.status(200).json({ message: "Login successful", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in student info
exports.getMe = async (req, res) => {
  try {
    const student = req.account; // always populated by Auth middleware
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update fee status for a course
exports.updateFeeStatus = async (req, res) => {
  try {
    const { courseId, feePaid } = req.body;

    // Use the authenticated user's ID from token
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const courseIndex = student.courses.findIndex(
      (c) => c.course.toString() === courseId
    );

    if (courseIndex >= 0) {
      student.courses[courseIndex].feePaid = feePaid;
    } else {
      return res.status(400).json({ message: "Course not found for this student" });
    }

    await student.save();
    res.status(200).json({ message: "Fee status updated", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout student
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // Make true in production with HTTPS
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
