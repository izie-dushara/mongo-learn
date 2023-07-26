// Connect to model
const User = require("../model/User");

const getAllUsers = async (req, res) => {
  // Get users from db
  const users = await User.find();
  // User exists
  if (!users) return res.status(204).json({ message: "No users found" });
  response.json(users);
};

const getUser = async (req, res) => {
  // ID validation
  if (!req.params?.id)
    return res.status(400).json({ message: "User ID required" });
  // Find user
  const user = await User.findOne({ _id: req.params.id });
  // User not found
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.params.id} not found` });
  }

  res.json(user);
};

const deleteUser = async (req, res) => {
  // ID validation
  if (!req?.body?.id)
    return res.status(400).json({ message: "User ID required" });
  // Get user
  const user = await User.findOne({ _id: req.body.id }).exec();
  // User not found
  if (!user) {
    return res
      .status(204)
      .json({ message: `User ID ${req.body.id} not found` });
  }
  const result = await user.deleteOne({ _id: req.body.id });
  res.json(result);
};

module.exports = {
  getAllUsers,
  getUser,
  deleteUser,
};
