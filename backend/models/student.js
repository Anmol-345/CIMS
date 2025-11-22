const mongoose = require("mongoose");

const courseMarksSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    marks: { 
      type: Number, // marks as a number
      default: null // null until assessed
    },
    feePaid: { type: Boolean, default: false } // fee status per course
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    courses: [courseMarksSchema],
    accountStatus: { type: String, enum: ["pending", "approved","rejected"], default: "pending" } ,
    level: { type: String, enum: ["PostGraduate", "UnderGraduate"], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
