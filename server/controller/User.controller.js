const User = require("../models/User.model");
const bcrypt = require("bcrypt");

// Get user by ID
exports.getUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the user" });
  }
};

exports.addUserByAdmin = async (req, res) => {
  try {
    let { name, email, phoneNumber, password, role } = req.body;

    if (!role) {
      role = "user";
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_PASS)
    );

    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      major: "",
      college: "",
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving users" });
  }
};

exports.getCountUsers = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while counting users" });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  const userId = req.params.userId;
  const { name, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json("User Updated");
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the user" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user" });
  }
};
