const express = require("express");
const router = express.Router();

const {
  addNotice,
  getNotices,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const Auth = require("../middlewares/auth");

// GET all notices
router.get("/", getNotices);

// ADD new notice
router.post("/add", new Auth(["admin"]).handle, addNotice);

// UPDATE notice
router.put("/update/:id", new Auth(["admin"]).handle, updateNotice);

// DELETE notice
router.delete("/delete/:id", new Auth(["admin"]).handle, deleteNotice);

module.exports = router;
