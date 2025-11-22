const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["PostGraduate", "UnderGraduate"],
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  fee: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);
