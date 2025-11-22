const Notice = require("../models/notice");

// Add Notice
exports.addNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newNotice = await Notice.create({
      title,
      description,
    });

    res.status(201).json({ message: "Notice created", notice: newNotice });
  } catch (error) {
    res.status(500).json({ message: "Error creating notice", error: error.message });
  }
};

// Get All Notices
exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });

    res.status(200).json({ notices });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notices", error: error.message });
  }
};

// Update Notice
exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    if (!updatedNotice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json({ message: "Notice updated", notice: updatedNotice });
  } catch (error) {
    res.status(500).json({ message: "Error updating notice", error: error.message });
  }
};

// Delete Notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Notice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.status(200).json({ message: "Notice deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notice", error: error.message });
  }
};
