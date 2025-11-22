const jwt = require("jsonwebtoken");
const Student = require("../models/student");
const Admin = require("../models/admin");
require("dotenv").config();

class Auth {
  constructor(allowedRoles = []) {
    this.allowedRoles = allowedRoles; // ["admin"], ["student"], or []
  }

  handle = async (req, res, next) => {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "No token, unauthorized" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // contains { id, role, name, email }

      let userData = null;

      if (decoded.role === "student") {
        userData = await Student.findById(decoded.id).select("-password");
        if (!userData) {
          return res.status(401).json({ message: "Invalid student" });
        }
        // Attach student data even if pending
        req.account = userData;

      } else if (decoded.role === "admin") {
        userData = await Admin.findById(decoded.id).select("-password");
        if (!userData) {
          return res.status(401).json({ message: "Invalid admin" });
        }
        req.account = userData;
      }

      // Role-based access
      if (this.allowedRoles.length > 0 && !this.allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next(); // proceed to controller
    } catch (error) {
      return res.status(500).json({
        message: "Authorization failed",
        error: error.message,
      });
    }
  };
}

module.exports = Auth;
