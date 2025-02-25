const User = require("../models/User.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

let temporaryUsers = {};

const signUp = async (req, res) => {
  try {
    let { name, email, phoneNumber, password, role, major, college } = req.body;

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

    const verificationCode = crypto.randomInt(100000, 999999);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    temporaryUsers[email] = {
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      major,
      college,
      verificationCode,
    };
    res.status(200).json({ message: "Verification code sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const userData = temporaryUsers[email];
    if (!userData) {
      return res.status(400).json({ message: "Invalid email or code" });
    }

    if (userData.verificationCode !== parseInt(code)) {
      return res.status(400).json({ message: "Incorrect verification code" });
    }
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      password: userData.password,
      role: userData.role,
      major: userData.major,
      college: userData.college,
    });

    await newUser.save();
    delete temporaryUsers[email];

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const accessToken = jwt.sign(
      {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1d" }
    );

    const refreshToken = jwt.sign(
      {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("SweetSpotToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      userData: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.SweetSpotToken;
    if (refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        (err, decoded) => {
          if (err) {
            return res.status(406).json({ message: "Unauthorized" });
          } else {
            const accessToken = jwt.sign(
              {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
              },
              process.env.JWT_ACCESS_SECRET,
              { expiresIn: "1d" }
            );
            return res.status(200).json({
              message: "Token refreshed successfully",
              accessToken,
              userData: {
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                role: decoded.role,
              },
            });
          }
        }
      );
    } else {
      return res.status(200).json({ message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const logOut = (req, res) => {
  res.cookie("SweetSpotToken", null, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 1,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_RESET_SECRET,
      { expiresIn: "1h" }
    );

    // Email content
    const resetLink = `http://localhost:5173/logIn/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Password Reset",
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error sending email",
        });
      }
      res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body; // Get token and newPassword from the request body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_PASS)
    );

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signUp,
  logIn,
  refresh,
  logOut,
  verifyCode,
  forgotPassword,
  resetPassword,
};
